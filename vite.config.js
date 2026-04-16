import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  base: '/devquest-terminal/',
  plugins: [
    react(),
    tailwindcss(),
    
  ],
  server: {
    proxy: {
      '/nekos': {
        target: 'https://api.nekosapi.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/nekos/, ''),
      },
    },
  },
})
