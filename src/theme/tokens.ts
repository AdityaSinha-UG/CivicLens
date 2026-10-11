/**
 * CivicLens Design Tokens
 * Bold, vibrant, orange-dominant Gen Z editorial palette.
 */

export const DESIGN_TOKENS = {
  colors: {
    bg: '#FA541C',               // Vibrant electric orange canvas
    bgDeep: '#E03E0B',           // Deep burnt orange
    bgLight: '#FF7A45',          // Warm energetic orange
    bgSubtle: '#FFF2E8',         // Light orange tint
    dark: '#121212',             // Ink black for high contrast
    darkSurface: '#1E1E1E',      // Charcoal card surface
    surface: '#FFFFFF',          // Crisp white card surface
    surfaceWarm: '#FFF8F4',      // Soft warm white surface
    neon: '#D4FF00',             // Electric lime accent
    accent: '#FA541C',           // Brand orange accent
    textDark: '#121212',         // High-contrast dark text
    textMuted: '#52525B',        // Muted neutral text
    textLight: '#FFFFFF',        // Pure white for overlays
    border: '#E4E4E7',           // Clean neutral border
    borderDark: '#27272A',       // Dark overlay border
  },
  typography: {
    fontDisplay: '"Syne", system-ui, sans-serif',
    fontSans: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
  },
  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    punchy: '0 8px 0px 0px #121212',
    card: '0 4px 20px -2px rgba(18, 18, 18, 0.12)',
    glow: '0 0 25px rgba(250, 84, 28, 0.4)',
  }
} as const;
