import Pagination from '@components/pagination';
import DashboardItem from './dashboard-item';
import { Product } from '@requests/get-paginated-games';
import { useEffect, useState } from 'react';
import { bulkIsGameSynced } from '@requests/db';

interface DashboardProps {
  items: Product[];
  pages: number
}

const Dasboard = ({ items, pages }: DashboardProps) => {
  const [syncedSet, setSyncedSet] = useState<Set<string>>(new Set());

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

  return (
    <>
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