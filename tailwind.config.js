/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        discord: {
          dark: '#1e1f22',
          sidebar: '#2b2d31',
          chat: '#313338',
          card: '#232428',
          hover: '#35373c',
          selected: '#3f4248',
          blurple: '#5865f2',
          'blurple-hover': '#4752c4',
          green: '#23a55a',
          yellow: '#f0b232',
          red: '#f23f43',
          'text-normal': '#dbdee1',
          'text-muted': '#949ba4',
          'text-header': '#f2f3f5',
          divider: '#35363c'
        }
      },
      fontFamily: {
        sans: ['"gg sans"', '"Noto Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
