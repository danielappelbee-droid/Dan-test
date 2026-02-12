// Dark mode color tokens for /canvas route
// Maps light mode tokens to their dark mode equivalents

export const darkModeTokens = {
  // Content colors - inverted for better readability in dark mode
  'wise-content-primary': '#F5F5F5',      // Light text for dark background
  'wise-content-secondary': '#B8B9B8',    // Secondary text
  'wise-content-tertiary': '#888988',     // Tertiary text/icons

  // Background colors - dark theme
  'wise-background-screen': '#0E0F0C',     // Main dark background
  'wise-background-elevated': '#1A1C19',   // Card/elevated surfaces
  'wise-background-neutral': 'rgba(159, 232, 112, 0.06)', // Subtle overlay
  'wise-background-overlay': 'rgba(159, 232, 112, 0.08)', // Modal overlays

  // Border colors - adjusted for dark theme
  'wise-border-neutral': 'rgba(245, 245, 245, 0.12)', // Subtle borders
  'wise-border-overlay': '#F5F5F5',       // Stronger borders when needed

  // Interactive colors - maintaining brand identity
  'wise-interactive-primary': '#9FE870',   // Keep bright green for CTAs
  'wise-interactive-accent': '#9FE870',    // Same as primary
  'wise-interactive-control': '#2F5711',   // Darker green for controls
  'wise-interactive-secondary': '#6A6C6A', // Muted secondary
  'wise-interactive-contrast': '#163300',  // Dark green contrast
  'wise-interactive-neutral-grey': '#2A2C29',        // Dark neutral
  'wise-interactive-neutral-grey-mid': '#252725',    // Darker mid
  'wise-interactive-neutral-grey-light': '#1F211E',  // Darkest light

  // Base colors
  'wise-base-light': '#0E0F0C',           // Now dark background
  'wise-base-dark': '#F5F5F5',            // Now light text
  'wise-base-contrast': '#0E0F0C',        // Dark background for contrast

  // Sentiment colors - slightly adjusted for dark theme
  'wise-sentiment-negative': '#E53E3E',    // Slightly brighter red
  'wise-sentiment-positive': '#38A169',    // Brighter green
  'wise-sentiment-warning': '#FFD700',     // Brighter yellow
  'wise-sentiment-positive-primary': '#2F855A',   // Green variant
  'wise-sentiment-warning-primary': '#FFD700',    // Yellow variant
  'wise-sentiment-negative-primary': '#E53E3E',   // Red variant

  // Link colors
  'wise-link-content': '#9FE870',         // Bright green for links

  // Disabled states
  'wise-disabled-background': '#2D2D2D',   // Dark disabled background
  'wise-disabled-text': '#6A6C6A',        // Muted disabled text

  // Brand colors - keep consistent but adjust for dark theme visibility
  'wise-green-bright': '#9FE870',         // Keep bright
  'wise-green-forest': '#2F5711',         // Lighter forest green
  'wise-green-positive': '#38A169',       // Adjusted positive
  'wise-orange-bright': '#FFC091',        // Keep bright
  'wise-yellow-bright': '#FFEB69',        // Keep bright
  'wise-yellow-warning': '#FFD700',       // Brighter warning
  'wise-blue-bright': '#A0E1E1',          // Keep bright
  'wise-pink-bright': '#FFD7EF',          // Keep bright
  'wise-purple-dark': '#5B2C87',          // Lighter purple
  'wise-gold-dark': '#8B7355',            // Lighter gold
  'wise-charcoal-dark': '#454745',        // Lighter charcoal
  'wise-maroon-dark': '#8B4513',          // Lighter maroon
};

export const lightModeTokens = {
  // Original light mode tokens for reference/toggle functionality
  'wise-content-primary': '#0E0F0C',
  'wise-content-secondary': '#454745',
  'wise-content-tertiary': '#6A6C6A',
  'wise-background-screen': '#FFFFFF',
  'wise-background-elevated': '#FFFFFF',
  'wise-background-neutral': 'rgba(22, 51, 0, 0.08)',
  'wise-background-overlay': 'rgba(22, 51, 0, 0.08)',
  'wise-border-neutral': 'rgba(14, 15, 12, 0.12)',
  'wise-border-overlay': '#0E0F0C',
  'wise-interactive-primary': '#163300',
  'wise-interactive-accent': '#9FE870',
  'wise-interactive-control': '#163300',
  'wise-interactive-secondary': '#868685',
  'wise-interactive-contrast': '#9FE870',
  'wise-interactive-neutral-grey': '#EDEFEC',
  'wise-interactive-neutral-grey-mid': '#EDEFEB',
  'wise-interactive-neutral-grey-light': '#FAFBFA',
  'wise-base-light': '#FFFFFF',
  'wise-base-dark': '#121511',
  'wise-base-contrast': '#FFFFFF',
  'wise-sentiment-negative': '#A8200D',
  'wise-sentiment-positive': '#2F5711',
  'wise-sentiment-warning': '#EDC843',
  'wise-sentiment-positive-primary': '#054D28',
  'wise-sentiment-warning-primary': '#FFD11A',
  'wise-sentiment-negative-primary': '#CB272F',
  'wise-link-content': '#163300',
  'wise-disabled-background': '#E5E5E5',
  'wise-disabled-text': '#9D9D9D',
};