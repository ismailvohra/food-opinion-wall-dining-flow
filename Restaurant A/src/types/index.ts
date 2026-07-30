export interface GossipBubble {
  id: string;
  text: string;
  emoji: string;
  mealType: 'lunch' | 'deli';
  timestamp: number;
  votes: number;
  x: number;
  y: number;
  size: number;
}

export type MealType = 'lunch' | 'deli' | null;