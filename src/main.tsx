import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@app/styles/global.css';
import { App } from '@/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@app/providers/query-client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
