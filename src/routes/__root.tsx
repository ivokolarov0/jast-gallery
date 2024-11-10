import { createRootRoute, Outlet } from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { GlobalProvider } from '../contexts/global';

// Create a client
const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: () => (
    <div className="container">
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <Outlet />
        </GlobalProvider>
      </QueryClientProvider>
    </div>
  ),
})