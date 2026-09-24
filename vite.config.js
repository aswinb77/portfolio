import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[hash:14][extname]',
        chunkFileNames: 'assets/[hash:14].js',
        entryFileNames: 'assets/[hash:14].js',
      },
    },
  },
})
