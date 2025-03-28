/** @type {import('tailwindcss').Config} */
import fontExtensions from './src/extensions/font-extensions';
import animationExtensions from './src/extensions/animation-extensions';
import keyframeExtensions from './src/extensions/keyframe-extensions';
import heightExtensions from './src/extensions/height-extensions';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        ...fontExtensions,
      },
      animation: {
        ...animationExtensions,
      },
      keyframes: {
        ...keyframeExtensions,
      },
      height: {
        ...heightExtensions,
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: 'class',
}

