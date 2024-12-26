import { Variant } from "@requests/get-catalog";

type PropType = {
  variant: Variant;
}

const LatestGamesPrice = ({ variant }: PropType) => {
  const isDiscount = variant.price < variant.originalPrice;

  const originalPrice = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(variant.originalPrice / 100);
  const price = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(variant.price / 100);

  return (
    <div className="price">
      {isDiscount && <s className="price__old">{originalPrice}</s>}
      <span className="price__current">{price}</span>
    </div>
  )
}

export default LatestGamesPrice