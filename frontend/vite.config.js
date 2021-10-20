import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import { minifyHtml } from 'vite-plugin-html';
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [
    WindiCSS(),
    svelte({
      preprocess: [sveltePreprocess({ typescript: true })],
    }),
    minifyHtml(),
  ],
  build: {
    outDir: '../build/public',
  },
});
