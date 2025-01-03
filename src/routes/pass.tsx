import { createFileRoute } from '@tanstack/react-router'
import Pass from '@components/pass/pass'

export const Route = createFileRoute('/pass')({
  component: () => <Pass />,
})
