import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    build: {
      rollupOptions: {
        // Asegurar que los archivos de datos se copien al build
        external: [],
      }
    },
    // Copiar archivos adicionales durante el build
    publicDir: 'public',
    
    // Configuración del servidor de desarrollo
    server: {
      port: 5173,
      proxy: {
        // Opcional: proxy para desarrollo si necesitas evitar CORS
        // '/api': {
        //   target: env.VITE_API_BASE_URL || 'http://localhost:5059',
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/api/, '')
        // }
      }
    },
    
    // Variables de entorno accesibles en el cliente
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL || 'http://localhost:5059'),
    }
  }
})
