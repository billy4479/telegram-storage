import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
const { typescript } = preprocess;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [typescript({})],
  kit: {
    adapter: adapter(),
    prerender: {
      default: true,
    },
  },
};

export default config;
