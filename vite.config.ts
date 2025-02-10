import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
    },
    define: {
      global: 'globalThis',
      // Expose env variables
      'process.env': env
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
  };
});
