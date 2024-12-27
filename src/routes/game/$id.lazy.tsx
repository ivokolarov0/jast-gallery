import { createLazyFileRoute } from '@tanstack/react-router'

import Layout from '@components/layout';
import Game from '@components/game/game';

export const Route = createLazyFileRoute('/game/$id')({
  component: () => {
    const { id } = Route.useParams()
    const { page, search }: {page: string, search: string} = Route.useSearch();
    
    return <Layout><Game page={page} search={search} id={id} /></Layout>
  },
})
