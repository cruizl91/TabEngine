import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    // Aumentamos el límite de advertencia de tamaño a 2000 kB para silenciar el aviso de AlphaTab
    chunkSizeWarningLimit: 2000,
  },
  optimizeDeps: {
    include: ['@coderline/alphatab']
  }
})