module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a1a1a',
        'dark-card': '#2a2a2a',
        'electric-blue': '#00bfff',
        'neon-green': '#39ff14',
        'gray-text': '#cccccc',
        'dark-border': '#444444',
      },

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 