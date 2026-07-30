import { Language } from '../hooks/useLanguage';
import { translations } from './translations';

export const getPresetGossips = (language: Language) => {
  const t = translations[language];
  
  const presets = [
    { text: t.tasty, emoji: "😋" },
    { text: t.delicious, emoji: "🤤" },
    { text: t.fresh, emoji: "✨" },
    { text: t.juicy, emoji: "💧" },
    { text: t.wellSeasoned, emoji: "🧂" },
    { text: t.ordinary, emoji: "😐" },
    { text: t.filling, emoji: "🤰" },
    { text: t.heavy, emoji: "⚖️" },
    { text: t.cold, emoji: "🧊" },
    { text: t.tooSalty, emoji: "🧂" },
    { text: t.dry, emoji: "🏜️" },
    { text: t.bland, emoji: "😑" }
  ];
  
  return {
    lunch: presets,
    deli: presets,
    grill: presets
  };
};

export const chefReactions = [
  "🤫",
  "👀", 
  "😏",
  "🧑‍🍳",
  "🕵️",
  "😈",
  "🤭",
  "👂"
];