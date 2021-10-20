/* eslint-disable global-require */
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.svelte', './src/**/*.html'],
  whitelistPatterns: [/svelte-/],
  defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
});

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('precss'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
