/** @type {import('tailwindcss').Config} */
import fontExtensions from './src/extensions/font-extensions';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ...fontExtensions,
      }
    },
  },
  plugins: [],
}

