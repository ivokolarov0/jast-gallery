import { createLazyFileRoute } from '@tanstack/react-router'

import { useGlobal } from '@contexts/global';
import Banner from '@components/banner/banner'
import Layout from '@components/layout';
import LatestGames from '@components/latest-games/latest-games'
import Pass from '@components/pass/pass';

export const Route = createLazyFileRoute('/')({
  component: () => {
    const { hasPasswordPage, securityPassed }: any = useGlobal();

    if(hasPasswordPage && !securityPassed) {
      return <Pass />
    }

    return (
      <Layout>
        <Banner />
        <LatestGames />
      </Layout>
    )
  },
})
