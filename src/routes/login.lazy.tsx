import { createLazyFileRoute } from '@tanstack/react-router'

import Layout from '@components/layout';
import LoginForm from '@components/login-form'

export const Route = createLazyFileRoute('/login')({
  component: () => <Layout><LoginForm /></Layout>,
})
