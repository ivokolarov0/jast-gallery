import { createLazyFileRoute } from '@tanstack/react-router'

import Game from '@components/game/game';

export const Route = createLazyFileRoute('/game/$id')({
  component: () => {
    const { id } = Route.useParams()
    const { page, search }: {page: string, search: string} = Route.useSearch();
    
    return <Game page={page} search={search} id={id} />
  },
})
