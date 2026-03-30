import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  document.body.textContent = 'Erro: elemento #root não existe no index.html.';
} else {
  void (async () => {
    try {
      const [{ ErrorBoundary }, { default: App }] = await Promise.all([
        import('./ErrorBoundary.tsx'),
        import('./App.tsx'),
      ]);

      createRoot(rootEl).render(
        <StrictMode>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </StrictMode>,
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      rootEl.innerHTML = `<div style="padding:24px;font-family:system-ui,sans-serif;max-width:36rem">
        <h1 style="font-size:1.125rem;margin:0 0 12px">Falha ao carregar o aplicativo</h1>
        <pre style="white-space:pre-wrap;background:#f4f4f5;padding:12px;border-radius:8px;font-size:13px;overflow:auto">${msg}</pre>
        <p style="margin-top:14px;color:#64748b;font-size:14px">Veja também o Console (F12) e o terminal do <code>npm run dev</code>.</p>
      </div>`;
      console.error(e);
    }
  })();
}
