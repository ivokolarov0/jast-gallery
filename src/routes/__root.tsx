import { createRootRoute, Outlet } from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import Layout from '@components/layout';

// Create a client
const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Outlet />
      </Layout>
    </QueryClientProvider>
  ),
})