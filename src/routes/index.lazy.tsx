import Banner from '@components/banner/banner'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: () => {
    return (
      <>
        <Banner />
      </>
    )
  },
})
