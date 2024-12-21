import { createRootRoute, Outlet } from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { GlobalProvider } from '@contexts/global';
import Layout from '@components/layout';

// Create a client
const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
        <GlobalProvider>
        <Layout>
          <Outlet />
        </Layout>
      </GlobalProvider>
    </QueryClientProvider>
  ),
})