import { resolve } from 'path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'

import pkg from './package.json'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    lib: {
      entry: resolve(__dirname, 'src/composables/index.ts'),
      name: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies), 'vue', 'axios'],
      output: {
        globals: {
          vue: 'Vue',
          axios: 'Axios'
        },
        entryFileNames: () => '[name].js'
      }
    }
  }
})
