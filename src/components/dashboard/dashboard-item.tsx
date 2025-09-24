import { Link, useSearch } from '@tanstack/react-router'
import { base } from '@requests/index'
import { ProductVariant } from '@requests/get-paginated-games';
import DashboardItemOverlay from './dashboard-item-overlay';
import DashboardItemBottom from './dashboard-item-bottom';

type PropType = {
  item: ProductVariant,
  synced?: boolean,
}

const DashboardItem = ({item, synced}: PropType) => {
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
          {synced && <span className="badge" title="Synced to DB">synced</span>}
          <img src={imagePath} alt="" className="game-box__image-main" />
          <DashboardItemOverlay platforms={item.platforms} />
        </div>
        <DashboardItemBottom item={item} />
      </Link>
    </div>
  )
}

export default DashboardItem