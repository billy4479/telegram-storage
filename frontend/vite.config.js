import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import { minifyHtml } from 'vite-plugin-html';
import WindiCSS from 'vite-plugin-windicss'
import { windi } from 'svelte-windicss-preprocess';

export default defineConfig({
  plugins: [
    WindiCSS(),
    windi(),
    svelte({
      preprocess: [sveltePreprocess({ typescript: true })],
    }),
    minifyHtml(),
  ],
  build: {
    outDir: '../build/public',
  },
});
