import { Link, useNavigate, useRoutes, type NavigateFunction } from "react-router-dom";
import { useEffect } from "react";
import routes from "./config";

let navigateResolver: (navigate: ReturnType<typeof useNavigate>) => void;

declare global {
  interface Window {
    REACT_APP_NAVIGATE: ReturnType<typeof useNavigate>;
  }
}

export const navigatePromise = new Promise<NavigateFunction>((resolve) => {
  navigateResolver = resolve;
});

export function AppRoutes() {
  const navigate = useNavigate();
  const element = useRoutes(routes);

  useEffect(() => {
    if (!window.REACT_APP_NAVIGATE) {
      window.REACT_APP_NAVIGATE = navigate;
      navigateResolver(window.REACT_APP_NAVIGATE);
    }
  }, [navigate]);

  if (!element) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center text-gray-600">
        <p>Nenhuma rota corresponde a esta URL.</p>
        <p className="text-sm text-gray-500 font-mono">{window.location.pathname}</p>
        <p className="text-sm text-gray-500 max-w-md">
          Se você rodou o build com subpasta (ex.: <code className="bg-gray-100 px-1 rounded">/helpdesk/</code>),
          abra o site nesse caminho ou defina <code className="bg-gray-100 px-1 rounded">VITE_BASE_PATH</code> no build.
        </p>
        <Link to="/" className="text-teal-600 font-medium underline">
          Ir para a página inicial
        </Link>
      </div>
    );
  }

  return element;
}
