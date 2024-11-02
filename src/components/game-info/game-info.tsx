import GameInfoItem from './game-info-item';

const GameInfo = ({ attributes }: any) => {
  const attrsUS = attributes.filter((attr: any) => attr.localeCode === "en_US");
  return (
    <div>
      {attrsUS.map((attr: any) => <GameInfoItem key={attr.id} attr={attr} />)}
    </div>
  )
}

export default GameInfo