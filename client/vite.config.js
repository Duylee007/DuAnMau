import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    },
    // Cho phép React SPA tự xử lý routing theo pathname (vd: /admin, /about)
    historyApiFallback: true
  }
});
