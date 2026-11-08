/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#173F35',
          dark: '#0F2B24',
          hover: '#1F4F43',
          light: '#285D4F',
        },
        moss: {
          DEFAULT: '#477C68',
          hover: '#3D6C5A',
          light: '#619B84',
        },
        sage: {
          DEFAULT: '#A8BDA9',
          light: '#EDF3ED',
          soft: '#E3ECE4',
          dark: '#8DA68E',
          border: '#D0DDD0',
        },
        cream: {
          bg: '#F5F5EF',
          surface: '#FAF9F5',
          card: '#FFFFFF',
          border: '#E3E8E1',
        },
        charcoal: {
          DEFAULT: '#252D29',
          muted: '#727B74',
          light: '#9DA69F',
        },
        status: {
          success: '#2F855A',
          warning: '#B7791F',
          error: '#C05656',
          info: '#477C91',
        }
      },
      borderRadius: {
        'btn': '8px',
        'card': '12px',
        'section': '16px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(23, 63, 53, 0.04), 0 4px 16px -2px rgba(23, 63, 53, 0.05)',
        'card-hover': '0 6px 20px -2px rgba(23, 63, 53, 0.08), 0 2px 6px -1px rgba(23, 63, 53, 0.04)',
        'elevated': '0 12px 32px -4px rgba(23, 63, 53, 0.12), 0 4px 12px -2px rgba(23, 63, 53, 0.06)',
        'subtle': '0 1px 2px 0 rgba(23, 63, 53, 0.04)',
      }
    },
  },
  plugins: [],
};
