import { createRootRoute, Outlet } from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { GlobalProvider } from '@contexts/global';

import '@src/i18n/config';

// Create a client
const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <Outlet />
      </GlobalProvider>
    </QueryClientProvider>
  ),
})