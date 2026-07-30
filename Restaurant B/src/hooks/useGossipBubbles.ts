import React from 'react';
import { useState, useCallback } from 'react';
import { GossipBubble } from '../types';
import { getCanonicalOpinion } from '../utils/translationMapping';
import { fetchTodaysVotes, ApiVote } from '../utils/api';

export const useGossipBubbles = () => {
  const checkOverlap = (newBubble: { x: number; y: number; size: number }, existingBubbles: GossipBubble[]) => {
    const minDistance = 12; // Minimum distance between bubble centers
    
    for (const bubble of existingBubbles) {
      const distance = Math.sqrt(
        Math.pow(newBubble.x - bubble.x, 2) + Math.pow(newBubble.y - bubble.y, 2)
      );
      
      // Adjust minimum distance based on bubble sizes
      const adjustedMinDistance = minDistance * (newBubble.size + bubble.size) / 2;
      
      if (distance < adjustedMinDistance) {
        return true;
      }
    }
    return false;
  };

  const findNonOverlappingPosition = (size: number, existingBubbles: GossipBubble[]) => {
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      const x = Math.random() * 75 + 5; // 5% to 80% horizontally (utilize more width)
      const y = Math.random() * 55 + 5; // 5% to 60% vertically (utilize more height, leave bottom 40% for indicator)
      
      const testBubble = { x, y, size };
      
      if (!checkOverlap(testBubble, existingBubbles)) {
        return { x, y };
      }
      
      attempts++;
    }
    
    // If we can't find a non-overlapping position, place it randomly
    return {
      x: Math.random() * 75 + 5,
      y: Math.random() * 55 + 5 // Keep within expanded safe zone
    };
  };

  const calculateWordCloudSizes = (bubbles: GossipBubble[]) => {
    if (bubbles.length === 0) return bubbles;
    
    const maxVotes = Math.max(...bubbles.map(b => b.votes));
    const minVotes = Math.min(...bubbles.map(b => b.votes));
    
    // Define size range for word cloud effect
    const minSize = 0.6;
    const maxSize = 2.5;
    
    return bubbles.map(bubble => {
      let normalizedSize;
      
      if (maxVotes === minVotes) {
        // All bubbles have same votes, use default size
        normalizedSize = 1.0;
      } else {
        // Scale votes to size range
        const voteRatio = (bubble.votes - minVotes) / (maxVotes - minVotes);
        normalizedSize = minSize + (voteRatio * (maxSize - minSize));
      }
      
      return {
        ...bubble,
        size: normalizedSize
      };
    });
  };

  const detectAndResolveOverlaps = (bubbles: GossipBubble[]) => {
    const resolvedBubbles = [...bubbles];
    let hasOverlaps = true;
    let iterations = 0;
    const maxIterations = 10;

    while (hasOverlaps && iterations < maxIterations) {
      hasOverlaps = false;
      iterations++;

      for (let i = 0; i < resolvedBubbles.length; i++) {
        for (let j = i + 1; j < resolvedBubbles.length; j++) {
          const bubble1 = resolvedBubbles[i];
          const bubble2 = resolvedBubbles[j];

          const distance = Math.sqrt(
            Math.pow(bubble1.x - bubble2.x, 2) + Math.pow(bubble1.y - bubble2.y, 2)
          );

          const minDistance = 15 * (bubble1.size + bubble2.size) / 2;

          if (distance < minDistance) {
            hasOverlaps = true;

            // Calculate direction vector
            let dx = bubble2.x - bubble1.x;
            let dy = bubble2.y - bubble1.y;

            // Handle case where bubbles are at exact same position
            if (dx === 0 && dy === 0) {
              dx = Math.random() - 0.5;
              dy = Math.random() - 0.5;
            }

            // Normalize direction
            const length = Math.sqrt(dx * dx + dy * dy) || 1;
            dx /= length;
            dy /= length;

            // Calculate how much to move each bubble
            const overlap = minDistance - distance;
            const moveDistance = overlap / 2 + 2; // Extra padding

            // Move bubbles apart
            const newX1 = bubble1.x - dx * moveDistance;
            const newY1 = bubble1.y - dy * moveDistance;
            const newX2 = bubble2.x + dx * moveDistance;
            const newY2 = bubble2.y + dy * moveDistance;

            // Keep bubbles within bounds (10% margin from edges, avoid bottom 30% for waiting indicator)
            resolvedBubbles[i] = {
              ...bubble1,
              x: Math.max(5, Math.min(80, newX1)), // Keep within 5-80% horizontally
              y: Math.max(5, Math.min(60, newY1)) // Keep within 5-60% vertically
            };

            resolvedBubbles[j] = {
              ...bubble2,
              x: Math.max(5, Math.min(80, newX2)), // Keep within 5-80% horizontally
              y: Math.max(5, Math.min(60, newY2)) // Keep within 5-60% vertically
            };
          }
        }
      }
    }

    return resolvedBubbles;
  };

  // Start with empty bubbles - we'll load from API
  const [bubbles, setBubbles] = useState<GossipBubble[]>([]);

  // Helper function to get emoji for vote text
  const getEmojiForVote = (voteText: string): string => {
    const emojiMap: Record<string, string> = {
      'Tasty': '😋',
      'Delicious': '🤤',
      'Fresh': '✨',
      'Juicy': '💧',
      'Well seasoned': '🧂',
      'Ordinary': '😐',
      'Filling': '🤰',
      'Heavy': '⚖️',
      'Cold': '🧊',
      'Too salty': '🧂',
      'Dry': '🏜️',
      'Bland': '😑'
    };
    
    return emojiMap[getCanonicalOpinion(voteText)] || '💭';
  };

  // Load API votes and add fake votes
  const loadApiVotes = useCallback(async () => {
    try {
      const apiVotes = await fetchTodaysVotes();
      
      // Count votes by canonical opinion and meal type
      const voteCounts: Record<string, number> = {};
      
      apiVotes.forEach(vote => {
        const canonical = getCanonicalOpinion(vote.vote);
        const key = `${canonical}-${vote.votetarget}`;
        voteCounts[key] = (voteCounts[key] || 0) + 1;
      });

      // Define the 6 fake votes we always add +1 to
      const fakeVotes = [
        { canonical: 'Tasty', mealType: 'lunch' as const, emoji: '😋' },
        { canonical: 'Delicious', mealType: 'lunch' as const, emoji: '🤤' },
        { canonical: 'Ordinary', mealType: 'lunch' as const, emoji: '😐' },
        { canonical: 'Filling', mealType: 'deli' as const, emoji: '🤰' },
        { canonical: 'Dry', mealType: 'deli' as const, emoji: '🏜️' },
        { canonical: 'Bland', mealType: 'lunch' as const, emoji: '😑' }
      ];

      // Add +1 to fake votes
      fakeVotes.forEach(fake => {
        const key = `${fake.canonical}-${fake.mealType}`;
        voteCounts[key] = (voteCounts[key] || 0) + 1;
      });

      // Create bubbles from vote counts
      const newBubbles: GossipBubble[] = [];
      
      Object.entries(voteCounts).forEach(([key, count], index) => {
        const [canonical, mealType] = key.split('-');
        const emoji = getEmojiForVote(canonical);
        
        const position = {
          x: (index % 4) * 18 + 8 + Math.random() * 12, // Spread across 4 columns, use more width
          y: Math.floor(index / 4) * 12 + 8 + Math.random() * 10 // More rows, better vertical distribution
        };

        newBubbles.push({
          id: `bubble-${key}`,
          text: canonical,
          emoji,
          mealType: mealType as 'lunch' | 'deli',
          timestamp: Date.now() - (index * 1000),
          votes: count,
          x: position.x,
          y: position.y,
          size: 1.0
        });
      });

      const sizedBubbles = calculateWordCloudSizes(newBubbles);
      setBubbles(detectAndResolveOverlaps(sizedBubbles));
      
    } catch (error) {
      console.error('Failed to load API votes:', error);
      // If API fails, show only the 6 fake votes
      const fakeVotes = [
        { text: 'Tasty', emoji: '😋', mealType: 'lunch' as const },
        { text: 'Delicious', emoji: '🤤', mealType: 'lunch' as const },
        { text: 'Ordinary', emoji: '😐', mealType: 'lunch' as const },
        { text: 'Filling', emoji: '🤰', mealType: 'deli' as const },
        { text: 'Dry', emoji: '🏜️', mealType: 'deli' as const },
        { text: 'Bland', emoji: '😑', mealType: 'lunch' as const }
      ];

      const fallbackBubbles = fakeVotes.map((opinion, index) => ({
        id: `fake-${index}`,
        text: opinion.text,
        emoji: opinion.emoji,
        mealType: opinion.mealType,
        timestamp: Date.now() - (index * 1000),
        votes: 1,
        x: (index % 4) * 18 + 8 + Math.random() * 12,
        y: Math.floor(index / 4) * 12 + 8 + Math.random() * 10,
        size: 1.0
      }));

      setBubbles(fallbackBubbles);
    }
  }, []);

  // Load API votes on mount
  React.useEffect(() => {
    loadApiVotes();
  }, [loadApiVotes]);

  // Set up polling every 15 seconds for real-time sync
  React.useEffect(() => {
    const interval = setInterval(() => {
      loadApiVotes();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loadApiVotes]);

  const addGossip = useCallback((text: string, emoji: string, mealType: 'lunch' | 'deli' | 'grill') => {
    const canonicalText = getCanonicalOpinion(text);
    const existingBubble = bubbles.find(b => getCanonicalOpinion(b.text) === canonicalText && b.mealType === mealType);
    
    if (existingBubble) {
      setBubbles(prevBubbles => {
        const updatedBubbles = prevBubbles.map(b => 
          b.id === existingBubble.id 
            ? { ...b, votes: b.votes + 1 }
            : b
        );
        const sizedBubbles = calculateWordCloudSizes(updatedBubbles);
        return detectAndResolveOverlaps(sizedBubbles);
      });
    } else {
      const initialSize = 1.0; // Will be recalculated
      const position = findNonOverlappingPosition(initialSize, bubbles);
      
      const newBubble: GossipBubble = {
        id: Math.random().toString(36).substr(2, 9),
        text: canonicalText,
        emoji,
        mealType,
        timestamp: Date.now(),
        votes: 1,
        x: position.x,
        y: position.y,
        size: initialSize
      };
      
      setBubbles(prev => {
        const updatedBubbles = [...prev, newBubble];
        const sizedBubbles = calculateWordCloudSizes(updatedBubbles);
        return detectAndResolveOverlaps(sizedBubbles);
      });
    }
  }, [bubbles]);

  const clearBubbles = useCallback(() => {
    setBubbles([]);
  }, []);

  return {
    bubbles,
    addGossip,
    clearBubbles,
    refreshVotes: loadApiVotes
  };
};