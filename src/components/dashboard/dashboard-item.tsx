import { Link, useSearch } from '@tanstack/react-router'
import { base } from '@requests/index'
import { ProductVariant } from '@requests/get-paginated-games';
import DashboardItemOverlay from './dashboard-item-overlay';
import DashboardItemBottom from './dashboard-item-bottom';
import { useEffect, useState } from 'react';
import { isGameSynced } from '@requests/db';

type PropType = {
  item: ProductVariant
}

const DashboardItem = ({item}: PropType) => {
  const { page, search, source, dbTags } = useSearch({ from: '/account' }) as {
    page: string,
    search: string,
    source?: string,
    dbTags?: string,
  }
  const imagePath = base + '/300/450/resize/' + item.productImage;
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const ok = await isGameSynced(item.productCode);
        setSynced(Boolean(ok));
      } catch {
        setSynced(false);
      }
    })();
  }, [item.productCode]);

  return (
    <div className="game-box">
      <Link
        to={`/game/${item.productCode}`} className="game-box__link"
        search={{ 
          page, 
          search,
          source,
          dbTags,
          gameid: item.gameId,
          translationId: item.game.translations.en_US.id
        }}
      >
        <div className="game-box__image">
          {synced && <span className="badge" title="Synced to DB">Synced</span>}
          <img src={imagePath} alt="" className="game-box__image-main" />
          <DashboardItemOverlay platforms={item.platforms} />
        </div>
        <DashboardItemBottom item={item} />
      </Link>
    </div>
  )
}

export default DashboardItem