
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import { AuthProvider } from './HD/contexts/AuthContext';

const routerBasename =
  (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '') || undefined;

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <AuthProvider>
        <Suspense
          fallback={
            <div
              style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f9fafb',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    margin: '0 auto',
                    border: '3px solid #e5e7eb',
                    borderTopColor: '#14b8a6',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: '#6b7280', marginTop: 12, fontSize: 14 }}>
                  Carregando…
                </p>
              </div>
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
