/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    screens: {
      '4xs': '280px',
      // => @media (min-width: 280px) { ... }

      '3.5xs': '320px',
      // => @media (min-width: 320px) { ... }

      '3xs': '375px',
      // => @media (min-width: 375px) { ... }

      '2xs': '414px',
      // => @media (min-width: 414px) { ... }

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      md2: '896px',
      // => @media (min-width: 896px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '1.5xl': '1348px',
      // => @media (min-width: 1348px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }

      '3xl': '1820px'
      // => @media (min-width: 1820px) { ... }
    },
    extend: {
      colors: {
        dark: '#0D0B32',
        'dark-0.7': 'rgba(13, 11, 50, 0.7)',
        'dark-blue': '#151245',
        white: '#ffffff',
        'blue-border': '#1D1776',
        purple: '#ff149d',
        'purple-0.15': 'rgba(75,52,167, 0.15)',
        'purple-0.5': 'rgba(75,52,167, 0.5)',
        pink: '#F205B3',
        darkBlue: '#060273',
        darkBlue2: '#0B0833',
        'dark-blue-0.4': '#4B34A7',
        blue1: '#035AA6',
        blue2: '#049DD9',
        gray50: '#F7F8F9',
        gray100: '#EEF0F3',
        gray200: '#D5DAE1',
        gray300: '#BBC3CF',
        gray400: '#8896AB',
        gray500: '#556987',
        gray600: '#4D5F7A',
        gray700: '#404F65',
        gray800: '#333F51',
        gray900: '#2A3342',
        green: '#22AD5C',
        red: '#F23030',
        yellow: '#FFD700',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
