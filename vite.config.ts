import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    sourcemap: mode !== 'production',
  },
  server: {
    port: 5173,
    proxy: {
      '/bff': {
        target: process.env.VITE_BFF_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}));
