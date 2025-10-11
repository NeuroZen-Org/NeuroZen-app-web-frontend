import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      // Asegurar que los archivos de datos se copien al build
      external: [],
    }
  },
  // Copiar archivos adicionales durante el build
  publicDir: 'public'
})
