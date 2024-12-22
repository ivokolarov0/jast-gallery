import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ContentLoader from 'react-content-loader'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import getBannerSlides from '@requests/get-website-banner';

type Slide = {
  href: string | null,
  img: string,
  srcset: string
}

type Data = {
  data: Slide[] | undefined
}

const Loader = () => (
  <ContentLoader
    viewBox="0 0 1412 513"
    speed={1}
    backgroundColor={'var(--c-border)'}
    foregroundColor={'var(--c-blue)'}
  >
    <rect x="0" y="0" width="1412" height="513" />
  </ContentLoader>
)

const Content = ({ data }: Data) => (
  <Swiper
    pagination={{ clickable: true }}
    modules={[Pagination]}
  >
    {data?.map((slide: any, index: number) => (
      <SwiperSlide key={index}>
        <a href={slide.href} target='_blank'>
          <img src={slide.srcset || slide.href} loading="lazy" alt="Banner" />
        </a>
      </SwiperSlide>
    ))}
  </Swiper>
)

const Banner = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['website'],
    placeholderData: keepPreviousData,
    queryFn: () => getBannerSlides(),
  });

  return (
    <div className='banner'>
      {isLoading ? <Loader /> : <Content data={data} />}
    </div>
  )
}

export default Banner