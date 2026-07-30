// Translation mapping to treat Finnish and English opinions as the same
export const opinionMapping: Record<string, string> = {
  // English to canonical (English)
  'Tasty': 'Tasty',
  'Delicious': 'Delicious', 
  'Fresh': 'Fresh',
  'Juicy': 'Juicy',
  'Well seasoned': 'Well seasoned',
  'Ordinary': 'Ordinary',
  'Filling': 'Filling',
  'Heavy': 'Heavy',
  'Cold': 'Cold',
  'Too salty': 'Too salty',
  'Dry': 'Dry',
  'Bland': 'Bland',
  
  // Finnish to canonical (English)
  'Maukas': 'Tasty',
  'Herkullinen': 'Delicious',
  'Tuore': 'Fresh', 
  'Mehevä': 'Juicy',
  'Hyvin maustettu': 'Well seasoned',
  'Arkinen': 'Ordinary',
  'Täyttävä': 'Filling',
  'Raskas': 'Heavy',
  'Kylmä': 'Cold',
  'Liian suolainen': 'Too salty',
  'Kuiva': 'Dry',
  'Mauton': 'Bland'
};

// Get the canonical form of an opinion
export const getCanonicalOpinion = (text: string): string => {
  return opinionMapping[text] || text;
};

// Get display text based on current language
export const getDisplayText = (canonicalText: string, language: 'fi' | 'en'): string => {
  if (language === 'fi') {
    // Find Finnish equivalent
    const finnishEntry = Object.entries(opinionMapping).find(([key, value]) => 
      value === canonicalText && key !== canonicalText
    );
    return finnishEntry ? finnishEntry[0] : canonicalText;
  }
  return canonicalText;
};