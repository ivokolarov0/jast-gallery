import Pagination from '@components/pagination';
import DashboardItem from './dashboard-item';
import { Product } from '@requests/get-paginated-games';
import { useEffect, useState } from 'react';
import { bulkIsGameSynced } from '@requests/db';
import VisibleSyncWorker from './visible-sync-worker';

interface DashboardProps {
  items: Product[];
  pages: number
}

const Dasboard = ({ items, pages }: DashboardProps) => {
  const [syncedSet, setSyncedSet] = useState<Set<string>>(new Set());
  const [syncingAll, setSyncingAll] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
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
  }, [items]);

  const startSyncVisible = () => {
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

  return (
    <>
      <div className="dashboard-actions" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className="btn" onClick={startSyncVisible} disabled={syncingAll || !items.length}>
          {syncingAll ? `Syncing ${idx}/${queue.length}… (${progress}%)` : 'Sync visible to DB'}
        </button>
      </div>

      {syncingAll && currentId && (
        <VisibleSyncWorker key={currentId} id={currentId} onDone={(ok: boolean) => handleWorkerDone(currentId, ok)} />
      )}

      <ul className="games-list">
        {items.map((item: Product) => (
          <li key={item.variant.gameId}>
            <DashboardItem item={item.variant} synced={syncedSet.has(item.variant.productCode)} />
          </li>
        ))}
      </ul>
      <Pagination pages={pages} />
    </>
  )
}

export default Dasboard