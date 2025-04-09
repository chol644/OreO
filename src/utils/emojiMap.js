export const incomeCategoryMap = {
  월급: '💰',
  부수입: '📦',
  용돈: '💸',
  상여: '🎉',
  금융소득: '🏦',
  기타: '🎁',
};

export const expenseCategoryMap = {
  식비: '🍔',
  교통비: '🚌',
  문화생활: '🎬',
  '마트/편의점': '🏪',
  '패션/미용': '👗',
  생활용품: '🧻',
  '공과금/주거': '🏠',
  통신비: '📱',
  건강: '💊',
  교육: '📚',
  '경조사/회비': '🎁',
  부모님: '👨‍👩‍👧‍👦',
  기타: '🎸',
};
export const emojiMap = {
  ...incomeCategoryMap,
  ...expenseCategoryMap,
};

export function getDisplayCategory(category, type) {
  let emoji = '';

  if (type === 'income') {
    emoji = incomeCategoryMap[category] || '';
  } else if (type === 'expense') {
    emoji = expenseCategoryMap[category] || '';
  } else {
    emoji = emojiMap[category] || ''; // fallback
  }

  return `${emoji} ${category}`;
}

export function removeEmoji(text) {
  return text
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .trim();
}
