import { createLazyFileRoute } from '@tanstack/react-router';

import Layout from '@components/layout';
import Account from '@components/account/account';

export const Route = createLazyFileRoute('/account')({
  component: () => <Layout><Account /></Layout>,
})
