import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ContentLoader from 'react-content-loader'
import { Swiper, SwiperRef } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { jastMedia } from '@utils/index'
import getCatalog, { Product, Image } from "@requests/get-catalog";
import 'swiper/css/navigation';
import { useRef } from "react";

const Loader = () => (
  <ContentLoader
    viewBox="0 0 1412 560"
    speed={1}
    backgroundColor={'var(--c-border)'}
    foregroundColor={'var(--c-blue)'}
  >
    <rect x="0" y="0" rx="4" ry="4" width="135" height="42" />
    <rect x="1173" y="0" rx="4" ry="4" width="239" height="42" />
    <rect x="0" y="72" width="1412" height="519" />
  </ContentLoader>
)

const Images = ({ data }: {data: Image[]}) => {
  const tailSearch = data.find((image: Image) => image.type === 'TALL_SEARCH_CATALOG');
  const thumb = data.find((image: Image) => image.type === '');

  return (
    <>
      <div className="latest-cames__cover">
        <img src={jastMedia + '/' + tailSearch?.path} />
      </div>
      <img src={jastMedia + '/' + thumb?.path} width="433" height="246" />
    </>
  )
}

const LatestGames = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['latest-games'],
    placeholderData: keepPreviousData,
    queryFn: () => getCatalog('new-titles_en_US'),
  });
  const swiper = useRef<SwiperRef>(null);

  if(isLoading) return <Loader />

  return (
    <div className='latest-games'>
      <div className="latest-games__head">
        <h2>New titles</h2>
        <a href="https://jastusa.com/games?catalogCode=new-titles_en_US" className="btn btn--empty btn--small" target="_blank">See all new titles</a>
      </div>
      <div className="latest-games__items">
        <button
          className="latest-games__button swiper-button-prev"
          onClick={() => swiper.current?.swiper.slidePrev()}
        ></button>
        <Swiper
          ref={swiper}
          slidesPerView={2}
          spaceBetween={24}
          modules={[Navigation]}
        >
          {data?.[0].products?.map((game: Product, index: number) => (
            <SwiperSlide key={index} className="latest-games__item">
              <a href={`https://jastusa.com/games/${game.code}/${game.translations.en_US.name}`} target='_blank'>
                <Images data={game.images} />
                <h3>{game.translations.en_US.name}</h3>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          className="latest-games__button swiper-button-next"
          onClick={() => swiper.current?.swiper.slideNext()}
        ></button>
      </div>
    </div>
  )
}

export default LatestGames