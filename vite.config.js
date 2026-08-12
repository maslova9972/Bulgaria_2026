import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const entry = (name) => fileURLToPath(new URL(name, import.meta.url))

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: entry('index.html'),
        breakfast: entry('breakfast.html'),
      },
    },
  },
})
