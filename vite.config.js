import { defineConfig } from 'vite'
import vue from '@vitejs.plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // Asegura que los activos CSS y JS se encuentren correctamente en Vercel/GitHub Pages
})