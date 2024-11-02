import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'

import { getGame, base } from '../../requests'
import Carousel from '../../components/carousel'
import BackBtn from '../../components/back-btn'
import Download from '../../components/download/download'

const excludeTypes = [
  'PRODUCT_MINIATURE',
  'TAIL_PACKAGE_THUMBNAIL_PRODUCT',
  'TALL_SEARCH_CATALOG',
]

export const jastMedia = import.meta.env.VITE_JAST_MEDIA

export const Route = createLazyFileRoute('/game/$id')({
  component: () => {
    const { id } = Route.useParams()
    const { page }: {page: string} = Route.useSearch();

    const { data } = useQuery({
      queryKey: ['game', id],
      queryFn: ({ queryKey }) => getGame(queryKey[1]),
    })
    const response = data?.[0]

    if (!response) {
      return <div>Loading...</div>
    }

    const coverImage = response.images.find(
      (image: any) => image.type === 'TAIL_PACKAGE_THUMBNAIL_PRODUCT',
    )
    const images = response.images
      .filter((image: any) => excludeTypes.indexOf(image.type) === -1)
      .map((image: any) => ({
        large: base + '/840/473/resize/' + image.path,
        small: base + '/128/96/resize/' + image.path,
      }))

    return (
      <div className="game-entry">
        <BackBtn page={page} />
        <div className="game-entry__header">
          <h2>{response.name}</h2>
        </div>
        <div className="game-entry__inner">
          <div className="game-entry__col">
            <Carousel images={images} />
            <div
              className="game-entry__desc"
              dangerouslySetInnerHTML={{ __html: response.description }}
            />
          </div>
          <div className="game-entry__col game-entry__col--right">
            {coverImage && (
              <div className="game-entry__cover">
                <img src={jastMedia + '/' + coverImage.path} />
              </div>
            )}
            <p
              dangerouslySetInnerHTML={{ __html: response.shortDescription }}
            />

            {response.productESRB.matureContent && (
              <div className="game-info__mature-hld">
                <div className="game-info__mature">
                  Adults Only<br /> 
                  Mature Content
                </div>
              </div>
            )}

            <hr />

            <Download id={response.code} page={page} />
          </div>
        </div>
      </div>
    )
  },
})
