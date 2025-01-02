import { ProductAttributeValue } from "@requests/get-game";
import GameInfoItemType from "./game-info-item-type";

type PropType = {
  attr: ProductAttributeValue
}

const GameInfoItem = ({ attr }: PropType) => {
  const title = attr.code.replace(/_/g, ' ');

  if(attr.code === 'video_html') {
    return null;
  }

  return (
    <div className="details-wrapper">
      <h5>{title}</h5>
      <div className="details">
        <GameInfoItemType attr={attr} />
      </div>
    </div>
  )
}

export default GameInfoItem