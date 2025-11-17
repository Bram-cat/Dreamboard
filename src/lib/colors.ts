// Color palette from coolors.co/0d0c1d - Dark modern theme
export const colors = {
  // Primary dark colors
  richBlack: '#0D0C1D',
  eerieBlack: '#1A1A2E',
  oxfordBlue: '#16213E',

  // Accent colors
  neonPurple: '#9D4EDD',
  electricViolet: '#7209B7',
  violetBlue: '#560BAD',
  byzantium: '#3C096C',

  // Gradient colors
  gradientPink: '#E0AAFF',
  gradientPurple: '#C77DFF',

  // Neutral colors
  white: '#FFFFFF',
  lightGray: '#E5E5E5',
  mediumGray: '#9CA3AF',
  darkGray: '#4B5563',

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export type ColorKey = keyof typeof colors;
