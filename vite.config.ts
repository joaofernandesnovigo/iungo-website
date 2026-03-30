import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

/** Base pública dos assets. Padrão `/`. Ex.: `VITE_BASE_PATH=helpdesk` no .env → `/helpdesk/`. */
function appBaseURL(mode: string): string {
  const env = loadEnv(mode, process.cwd(), '');
  const raw = (env.VITE_BASE_PATH ?? process.env.VITE_BASE_PATH)?.trim();
  if (!raw) return '/';
  const clean = raw.replace(/^\/+|\/+$/g, '');
  return clean ? `/${clean}/` : '/';
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: appBaseURL(mode),
  server: {
    port: 3000,
    strictPort: false,
    open: true,
  },
}));
