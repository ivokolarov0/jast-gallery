import { excludeTypes } from '@utils/index'
import { base } from '@requests/index'
import Carousel from '@components/carousel';
import { Product } from '@requests/get-game';

const GameImages = ({ data }: {data: Product}) => {
  const images = data?.images?.filter((image: any) => excludeTypes.indexOf(image.type) === -1)
    .map((image: any) => ({
      large: base + '/840/473/resize/' + image.path,
      small: base + '/128/96/resize/' + image.path,
    }))

  if(!images) {
    return null;
  }

  return (
    <Carousel images={images} />
  )
}

export default GameImages