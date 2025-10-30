import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
