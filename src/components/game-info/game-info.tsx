import { ProductAttributeValue } from '@requests/get-game';
import GameInfoItem from './game-info-item';

type PropType = {
  attributes: ProductAttributeValue[]
}

const GameInfo = ({ attributes }: PropType) => {
  const attrsUS = attributes.filter((attr: ProductAttributeValue) => attr.localeCode === "en_US");
  return (
    <div>
      {attrsUS.map((attr: ProductAttributeValue) => <GameInfoItem key={attr.id} attr={attr} />)}
    </div>
  )
}

export default GameInfo