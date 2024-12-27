import Pass from '@components/pass/pass'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pass')({
  component: () => <Pass />,
})
