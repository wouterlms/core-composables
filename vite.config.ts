import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

import pkg from './package.json'

export default defineConfig({
  plugins: [ vue() ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      }
    ],
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    lib: {
      entry: resolve(__dirname, 'src/composables/index.ts'),
      name: 'index',
      formats: [ 'es' ],
    },
    rollupOptions: {
      external: Object.keys(pkg.dependencies),
      output: {
        globals: {
          vue: 'Vue',
        },
        entryFileNames: () => '[name].js',
      },
    },
  },
})
