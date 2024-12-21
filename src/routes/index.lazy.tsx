import { createLazyFileRoute } from '@tanstack/react-router'
import Layout from '@components/layout'

export const Route = createLazyFileRoute('/')({
  component: () => {

    return (
      <h2>Home</h2>
    )
  },
})
