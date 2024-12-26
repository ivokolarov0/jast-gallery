import { createLazyFileRoute } from '@tanstack/react-router';

import Account from '@components/account/account';

export const Route = createLazyFileRoute('/account')({
  component: () => {
    const { page, search }: { page: string; search: string } = Route.useSearch()

    return <Account page={page} search={search} />;
  },
})
