import { createLazyFileRoute } from '@tanstack/react-router'
import Security from '@components/security/security'
import Layout from '@components/layout';

export const Route = createLazyFileRoute('/settings/security')({
  component: () => <Layout><Security /></Layout>,
})
