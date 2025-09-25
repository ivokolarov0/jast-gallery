import { ProductAttributeValue } from '@requests/get-game';
import GameInfoItem from './game-info-item';
import type { GameDB } from '@requests/db';

type PropType = {
  attributes: ProductAttributeValue[]
  db: GameDB
}

const GameInfo = ({ attributes, db }: PropType) => {
  const attrsUS =attributes.filter((attr: ProductAttributeValue) => attr.localeCode === "en_US");
  return (
    <div>
      {attrsUS.map((attr: ProductAttributeValue) => <GameInfoItem key={attr.id} attr={attr} db={db} />)}
    </div>
  )
}

export default GameInfo