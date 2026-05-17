import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['framer-motion'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    deps: {
      // Ensure ESM-only packages (framer-motion, Chakra UI) are processed
      // by Vite's pipeline rather than Node's native ESM loader
      inline: ['framer-motion', '@chakra-ui/react', '@chakra-ui/system'],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://data912.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
