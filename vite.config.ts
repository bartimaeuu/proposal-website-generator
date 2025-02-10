import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser'
    }
  },
  build: {
    rollupOptions: {
      external: [
        'crypto',
        'fs',
        'path',
        'url',
        'http',
        'https',
        'stream',
        'zlib'
      ]
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      supported: { 
        bigint: true 
      },
      define: {
        global: 'globalThis'
      }
    }
  }
});
