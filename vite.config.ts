import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/helpdesk/',
  define: {
    __BASE_PATH__: JSON.stringify('/helpdesk')
  },
  server: {
    port: 3000,
    open: true
  }
});
