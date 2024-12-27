import { SwiperSlide, Swiper } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { excludeTypes } from '@utils/index'
import { base } from '@requests/index'
import { Product, ProductImage } from '@requests/get-game';

const GameImages = ({ data }: {data: Product}) => {
  const images = data?.images?.filter((image: ProductImage) => excludeTypes.indexOf(image.type) === -1)
    .map((image: ProductImage) => ({
      large: base + '/840/473/resize/' + image.path,
      small: base + '/128/96/resize/' + image.path,
    }))

  if(!images) {
    return null;
  }

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<div class="${className}"><img src="${images[index].small}" /></div>`
    },
  };

  return (
    <div className="game-carousel">
      <button className="swiper-button-prev"></button>
      <Swiper
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        centeredSlides={true}
        pagination={pagination}
        spaceBetween={40}
        modules={[Navigation, Pagination]}
      >
        {images.map((image: { large: string; small: string }, index: number) => (
          <SwiperSlide key={index}>
            <img src={image.large} width={840} height={473} alt={`Game image ${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="swiper-button-next"></button>
    </div>
  )
}

export default GameImages