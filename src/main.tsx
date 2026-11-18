import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { API_CONFIG } from './apiConfig';
import App from './App';
import './index.css';

const startApp = async () => {
  if (API_CONFIG.useMockServer) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledFrame: 'bypass',
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    });
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

void startApp();
