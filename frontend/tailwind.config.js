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
        bodywise: {
          50: '#faf7fc',
          100: '#f3eef8',
          200: '#ebdff3',
          300: '#dec7ea',
          400: '#c8a4dc',
          500: '#ae7ecc',
          600: '#945bb7',
          700: '#7c469b',
          800: '#673a7f',
          900: '#553267',
          950: '#351a42',
        },
        lavender: {
          light: '#fbf9fe',
          surface: '#f4f0fa',
          muted: '#e9e1f5',
          border: '#ddd1ee',
          accent: '#8e5cc5',
          deep: '#4b2a6b',
        },
        rose: {
          soft: '#fdf2f4',
          accent: '#e07a89',
        },
        sage: {
          soft: '#f1f8f3',
          accent: '#529b68',
        }
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(124, 70, 155, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(124, 70, 155, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 12px 32px -4px rgba(90, 40, 120, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}

