import { createLazyFileRoute } from '@tanstack/react-router';

import Account from '@components/account/account';

export const Route = createLazyFileRoute('/account')({
  component: () => <Account />,
})
