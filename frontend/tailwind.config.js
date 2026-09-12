/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#102a43',
          dark: '#0b1d2e',
          light: '#15344f',
          hover: '#1b425d',
        },
        brand: {
          blue: '#2774c9',
          green: '#2b946b',
          amber: '#c68b1d',
          red: '#c94d47',
          paper: '#f6f8fb',
          line: '#e6ebf0',
          muted: '#718096',
          ink: '#1b2b3a',
        },
        risk: {
          high: '#c94d47',
          'high-bg': '#fbeceb',
          medium: '#c68b1d',
          'medium-bg': '#fff5dc',
          low: '#2b946b',
          'low-bg': '#e8f6ef',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      }
    }
  },
  plugins: [],
}