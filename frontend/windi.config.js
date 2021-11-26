import { defineConfig } from 'windicss/helpers';

defineConfig({
  extract: {
    content: ['./src/**/*.svelte', './src/**/*.css'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
