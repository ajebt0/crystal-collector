import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser'
  },
  base: './', // Важно! Правильные пути для продакшена
  optimizeDeps: {
    include: ['three']
  },
  resolve: {
    alias: {
      '@': '/client'
    }
  }
})
