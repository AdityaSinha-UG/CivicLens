/**
 * CivicLens Design Tokens
 * Centralized palette and typography for the editorial civic theme.
 */

export const DESIGN_TOKENS = {
  colors: {
    bg: '#FBE5D6',               // Soft peach main background
    surface: '#FFF9F4',          // Warm light card & content surfaces
    surfaceHover: '#FCF4ED',
    surfaceMuted: '#F5EAE0',
    text: '#292923',             // Primary dark slate text
    textMuted: '#615E52',        // Secondary readable text
    textLight: '#827E70',
    accent: '#315B48',           // Primary forest green accent
    accentHover: '#244637',
    accentLight: '#E8F0EC',
    highlight: '#D9A441',        // Warm mustard / gold secondary highlight
    highlightHover: '#C59132',
    highlightLight: '#FAF2E3',
    border: '#E5D3C2',           // Subtle warm neutral border
    borderSubtle: '#EFE1D4',
    borderDark: '#C9B29F',
    error: '#A7382B',
    errorLight: '#FCEBE9',
  },
  typography: {
    fontSerif: '"Lora", Georgia, serif',
    fontSans: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
  },
  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    subtle: '0 1px 3px 0 rgba(41, 41, 35, 0.05), 0 1px 2px -1px rgba(41, 41, 35, 0.05)',
    card: '0 2px 6px 0 rgba(41, 41, 35, 0.06), 0 1px 3px 0 rgba(41, 41, 35, 0.04)',
    hover: '0 6px 16px -2px rgba(41, 41, 35, 0.08), 0 2px 6px -1px rgba(41, 41, 35, 0.04)',
  }
} as const;
