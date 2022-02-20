import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
const { typescript } = preprocess;

import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [typescript({})],
  kit: {
    adapter: adapter(),

    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',

    vite: {
      plugins: [],
      resolve: {
        alias: {
          $comp: path.resolve('./src/Components'),
          $lib: path.resolve('./src/lib'),
        },
      },
    },
  },
};

export default config;
