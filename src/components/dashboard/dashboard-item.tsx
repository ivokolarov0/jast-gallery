import { Link, useSearch } from '@tanstack/react-router'
import { base } from '@requests/index'
import { ProductVariant } from '@requests/get-paginated-games';
import DashboardItemOverlay from './dashboard-item-overlay';

type PropType = {
  item: ProductVariant
}

const DashboardItem = ({item}: PropType) => {
  const {page, search} = useSearch({ from: '/account' }) as {
    page: string,
    search: string
  }
  const imagePath = base + '/300/450/resize/' + item.productImage;

  return (
    <div className="game-box">
      <Link
        to={`/game/${item.productCode}`} className="game-box__link"
        search={{ 
          page, 
          search, 
          gameid: item.gameId,
          translationId: item.game.translations.en_US.id
        }}
      >
        <div className="game-box__image">
          <img src={imagePath} alt="" className="game-box__image-main" />
          <DashboardItemOverlay platforms={item.platforms} />
        </div>
        <div className="game-box__details">
          <h5>{item.productName}</h5>
          {item.userGameTags.length > 0 && <div className="game-box__tags">
            {item.userGameTags.map((tag: any) => (
              <span key={tag['@id']} className={`tag tag--${tag.type}`}>{tag.type}</span>
            ))}
          </div>}
        </div>
      </Link>
    </div>
  )
}

export default DashboardItem