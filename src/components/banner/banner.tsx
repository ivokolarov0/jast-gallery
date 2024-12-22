import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import Loading from '@components/loading';
import getBannerSlides from '@requests/get-website-banner';

const Banner = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['website'],
    placeholderData: keepPreviousData,
    queryFn: () => getBannerSlides(),
  });

  if(isLoading) {
    return <Loading />
  }

  return (
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
}

export default Banner