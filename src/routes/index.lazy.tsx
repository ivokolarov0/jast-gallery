import { createLazyFileRoute } from '@tanstack/react-router'

import Banner from '@components/banner/banner'
import LatestGames from '@components/latest-games/latest-games'

export const Route = createLazyFileRoute('/')({
  component: () => {
    return (
      <>
        <Banner />
        <LatestGames />
      </>
    )
  },
})
