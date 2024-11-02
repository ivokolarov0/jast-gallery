import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { GlobalProvider } from '../contexts/global';

// Create a client
const queryClient = new QueryClient()


export const Route = createRootRoute({
  component: () => (
    <>
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <Outlet />
        <TanStackRouterDevtools />
      </GlobalProvider>
    </QueryClientProvider>
    </>
  ),
})