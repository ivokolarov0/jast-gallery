import Pagination from '@components/pagination';
import DashboardItem from './dashboard-item';
import { Product } from '@requests/get-paginated-games';
import { useEffect, useState } from 'react';
import { bulkIsGameSynced, GameListItem } from '@requests/db';
import VisibleSyncWorker from './visible-sync-worker';
import { Link, useSearch } from '@tanstack/react-router';
import { base } from '@requests/index';

export interface DashboardProps {
  items: Product[];
  pages: number;
  dbItems?: GameListItem[];
}

const Dasboard = ({ items, pages, dbItems }: DashboardProps) => {
  const [syncedSet, setSyncedSet] = useState<Set<string>>(new Set());
  const [syncingAll, setSyncingAll] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  const usingDb = Array.isArray(dbItems);

  const { search, dbTags, page } = useSearch<any>({ from: '/account' });

  useEffect(() => {
    if (usingDb) return;
    const ids = items.map(i => i.variant.productCode).filter(Boolean);
    if (!ids.length) {
      setSyncedSet(new Set());
      return;
    }
    (async () => {
      try {
        const statuses = await bulkIsGameSynced(ids);
        const onlySynced = new Set(statuses.filter(s => s.synced).map(s => s.jast_id));
        setSyncedSet(onlySynced);
      } catch {
        setSyncedSet(new Set());
      }
    })();
  }, [items, usingDb]);

  const startSyncVisible = () => {
    if (usingDb) return; // no sync action in db mode
    const idsRaw = items.map(i => i.variant.productCode).filter(Boolean);
    const ids = Array.from(new Set(idsRaw)).filter(id => !syncedSet.has(id));
    if (!ids.length) return;
    setQueue(ids);
    setIdx(0);
    setSyncingAll(true);
  };

  const handleWorkerDone = (id: string, ok: boolean) => {
    if (ok) {
      setSyncedSet(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }
    setIdx(prev => {
      const next = prev + 1;
      if (next >= queue.length) {
        setSyncingAll(false);
      }
      return next;
    });
  };

  const currentId = queue[idx];
  const progress = queue.length ? Math.min(100, Math.round(((idx) / queue.length) * 100)) : 0;

  const imagePath = base + '/300/450/resize/';

  const dbLinkSearch = { source: 'db', dbTags: dbTags || '', search: search || '' };
  const currentPage = Number(page) || 1;

  return (
    <>
      {!usingDb && (
        <div className="dashboard-actions" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button className="btn" onClick={startSyncVisible} disabled={syncingAll || !items.length}>
            {syncingAll ? `Syncing ${idx}/${queue.length}… (${progress}%)` : 'Sync visible to DB'}
          </button>
        </div>
      )}

      {!usingDb && syncingAll && currentId && (
        <VisibleSyncWorker key={currentId} id={currentId} onDone={(ok: boolean) => handleWorkerDone(currentId, ok)} />
      )}

      <ul className="games-list">
        {usingDb ? (
          (dbItems || []).map((g) => (
            <li key={g.jast_id}>
              <Link to={`/game/${g.jast_id}`} className="game-box__link" search={{ ...dbLinkSearch, page: currentPage }}>
                <div className="game-box">
                  <div className="game-box__image">
                    {g.cover_image && <img src={imagePath + g.cover_image} alt="" className="game-box__image-main" />}
                  </div>
                  <div className="game-box__details">
                    <h6>{g.name}</h6>
                  </div>
                </div>
              </Link>
            </li>
          ))
        ) : (
          items.map((item: Product) => (
            <li key={item.variant.gameId}>
              <DashboardItem item={item.variant} /* synced computed in list; omit prop to use internal check */ />
            </li>
          ))
        )}
      </ul>

      {usingDb ? (
        <ul className="pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <li key={n} className={n === currentPage ? 'active' : undefined}>
              <Link to="/account" search={{ ...dbLinkSearch, page: n }}>{n}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <Pagination pages={pages} />
      )}
    </>
  )
}

export default Dasboard