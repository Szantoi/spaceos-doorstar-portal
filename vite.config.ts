import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    sourcemap: mode !== 'production',
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    watch: {
      ignored: [
        '**/mailbox/**',
        '**/docs/**',
        '**/*.md',
      ],
      followSymlinks: false,   // ELOOP-védelem: szimlink loopok kezelése
    },
    proxy: {
      '/bff': {
        target: process.env.VITE_BFF_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}));
