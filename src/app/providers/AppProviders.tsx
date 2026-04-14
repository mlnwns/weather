import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { BrowserRouter } from 'react-router';
import { BookmarksProvider } from '@/entities/bookmark';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <BookmarksProvider>{children}</BookmarksProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
