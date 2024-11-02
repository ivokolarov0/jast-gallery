import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/game/$id')({
  component: () => <div>Hello /game/$id!</div>,
})
