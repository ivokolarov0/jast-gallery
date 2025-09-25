import { ProductAttributeValue } from "@requests/get-game";
import GameInfoItemType from "./game-info-item-type";
import type { GameDB } from '@requests/db';

type PropType = {
  attr: ProductAttributeValue
  db: GameDB | undefined | null
}

const GameInfoItem = ({ attr, db }: PropType) => {
  const title = attr.code.replace(/_/g, ' ');
  
  if(attr.code === 'video_html') {
    return null;
  }

  return (
    <div className="details-wrapper">
      <h5>{title}</h5>
      <div className="details">
        <GameInfoItemType db={db} attr={attr} />
      </div>
    </div>
  )
}

export default GameInfoItem