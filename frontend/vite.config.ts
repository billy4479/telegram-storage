import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $comp: path.resolve('./src/Components'),
      // $lib: path.resolve('./src/lib'),
    },
  },
});
