import { ProductVariant } from '@requests/get-paginated-games';

type PropType = {
  item: ProductVariant
}

interface GameTag {
  '@id': string;
  type: string;
}

const DashboardItemBottomTag = ({tag}: {tag: GameTag}) => {
  const title = tag.type.replace(/_/g, ' ');

  return <span key={tag['@id']} className={`tag tag--${tag.type}`}>{title}</span>
}

const DashboardItemBottom = ({ item }: PropType) => {
  return (
    <div className="game-box__details">
        <h6>{item.productName}</h6>
        {item.userGameTags.length > 0 && <div className="game-box__tags">
          {item.userGameTags.map((tag: GameTag) => <DashboardItemBottomTag key={tag['@id']} tag={tag} />)}
        </div>}
      </div>
  )
}

export default DashboardItemBottom