import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import DOMPurify from 'dompurify';

import { excludeTypes, jastMedia } from '@utils/index'
import getPaginatedGames from '@requests/get-paginated-games';
import getGame from '@requests/get-game';
import { base } from '@requests/index'
import Carousel from '@components/carousel'
import BackBtn from '@components/back-btn'
import Download from '@components/download/download'
import GameInfo from '@components/game-info/game-info'
import Played from '@components/played';
import Loading from '@components/loading';

export const Route = createLazyFileRoute('/game/$id')({
  component: () => {
    const { id } = Route.useParams()
    const { page, search }: {page: string, search: string} = Route.useSearch();
    const { data } = useQuery({
      queryKey: ['game', id],
      placeholderData: keepPreviousData,
      queryFn: ({ queryKey }) => getGame(queryKey[1]),
      
    });
    const response = data?.[0];
    const { data: searchedGames, isRefetching } = useQuery({
      queryKey: ['searched-games', page, search],
      queryFn: () => getPaginatedGames('1', response?.name),
      placeholderData: keepPreviousData,
      enabled: !!response
    })
    const findCurrentGame = searchedGames?.[0]?.products?.find((item: any) => item.variant.productCode === response?.code);

    if (!response) {
      return <Loading />
    }
    
    const video = response?.attributes?.find(
      (attr: any) => attr.code === 'video_html',
    );

    const coverImage = response?.images?.find(
      (image: any) => image.type === 'TAIL_PACKAGE_THUMBNAIL_PRODUCT',
    )
    const images = response?.images?.filter((image: any) => excludeTypes.indexOf(image.type) === -1)
      .map((image: any) => ({
        large: base + '/840/473/resize/' + image.path,
        small: base + '/128/96/resize/' + image.path,
      }))

    const videoSanitize = DOMPurify.sanitize(video?.value, {ALLOWED_TAGS: ['iframe']});
    const shortDescriptionSanitize = DOMPurify.sanitize(response?.shortDescription);
    const descriptionSanitize = DOMPurify.sanitize(response?.description);

    return (
      <div className="game-entry">
        <div className="game-entry__top">
          <BackBtn page={page} />
          
          {findCurrentGame && !isRefetching ? (
            <Played data={findCurrentGame.variant} page={page} search={search} />
          ) : <Loading />}
        </div>
        <div className="game-entry__header">
          <h2>{response.name}</h2>
        </div>
        <div className="game-entry__inner">
          <div className="game-entry__col">
            {images && <Carousel images={images} />}
            
            {video && <div className="video-target" dangerouslySetInnerHTML={{__html: videoSanitize}}></div>}
            <div
              className="game-entry__desc"
              dangerouslySetInnerHTML={{ __html: descriptionSanitize }}
            />
            {response?.attributes && <GameInfo attributes={response?.attributes} />}
          </div>
          <div className="game-entry__col game-entry__col--right">
            {coverImage && (
              <div className="game-entry__cover">
                <img src={jastMedia + '/' + coverImage.path} />
              </div>
            )}
            <p
              dangerouslySetInnerHTML={{ __html: shortDescriptionSanitize }}
            />

            {response?.productESRB?.matureContent && (
              <div className="game-info__mature-hld">
                <div className="game-info__mature">
                  Adults Only<br /> 
                  Mature Content
                </div>
              </div>
            )}

            <hr />

            <Download id={response.code} page={page} search={search} />
          </div>
        </div>
      </div>
    )
  },
})
