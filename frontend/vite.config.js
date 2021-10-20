import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import { minifyHtml } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    svelte({
      preprocess: [sveltePreprocess({ typescript: true, postcss: true })],
    }),
    minifyHtml(),
  ],
  build: {
    outDir: '../build/public',
  },
});
