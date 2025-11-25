/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#D62828',
          red: '#B91C1C',
          green: '#009246',
          yellow: '#F4C430',
          dark: '#09090b',
          gray: '#18181b',
          light: '#F5F5F5'
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'fly-to-cart': 'flyToCart 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flyToCart: {
          '0%': {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
            opacity: '1',
          },
          '60%': {
            opacity: '1',
          },
          '100%': {
            top: '30px',
            left: 'calc(100% - 50px)',
            transform: 'translate(-50%, -50%) scale(0.1) rotate(360deg)',
            opacity: '0',
          }
        }
      }
    },
  },
  plugins: [],
}
