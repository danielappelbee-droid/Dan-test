import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wise: {
          green: {
            bright: '#9FE870',
            forest: '#163300',
            positive: '#2F5711',
          },
          orange: {
            bright: '#FFC091',
          },
          yellow: {
            bright: '#FFEB69',
            warning: '#EDC843',
          },
          blue: {
            bright: '#A0E1E1',
          },
          pink: {
            bright: '#FFD7EF',
          },
          purple: {
            dark: '#260A2F',
          },
          gold: {
            dark: '#3A341C',
          },
          charcoal: {
            dark: '#21231D',
          },
          maroon: {
            dark: '#320707',
          },
          content: {
            primary: '#0E0F0C',
            secondary: '#454745',
            tertiary: '#6A6C6A',
          },
          interactive: {
            primary: '#163300',
            accent: '#9FE870',
            control: '#163300',
            secondary: '#868685',
            contrast: '#9FE870',
            'neutral-grey': '#EDEFEC',
            'neutral-grey-mid': '#EDEFEB',
            'neutral-grey-light': '#FAFBFA',
          },
          background: {
            screen: '#FFFFFF',
            elevated: '#FFFFFF',
            neutral: 'rgba(22, 51, 0, 0.08)',
            overlay: 'rgba(22, 51, 0, 0.08)',
          },
          border: {
            neutral: 'rgba(14, 15, 12, 0.12)',
            overlay: '#0E0F0C',
          },
          base: {
            light: '#FFFFFF',
            dark: '#121511',
            contrast: '#FFFFFF',
          },
          sentiment: {
            negative: '#A8200D',
            positive: '#2F5711',
            warning: '#EDC843',
            'positive-primary': '#054D28',
            'warning-primary': '#FFD11A',
            'negative-primary': '#CB272F',
          },
          link: {
            content: '#163300',
          },
          disabled: {
            background: '#E5E5E5',
            text: '#9D9D9D',
          },
        },
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#9FE870',
          600: '#16a34a',
          700: '#163300',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
      },
      fontFamily: {
        'header': ['Inter', 'Inter-Fallback', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'body': ['Inter', 'Inter-Fallback', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'wise': ['WiseSans', 'Inter', 'Inter-Fallback', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;