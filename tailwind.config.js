/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        darumadrop: ["Darumadrop One", "sans-serif"], 
        slackey: ["Slackey", "sans-serif"],// Add the font here
      },
    },
  },
  plugins: [],
};
