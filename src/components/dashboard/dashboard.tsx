import Pagination from '@components/pagination';
import DashboardItem from './dashboard-item';
import { Product } from '@requests/get-paginated-games';

interface DashboardProps {
  items: Product[];
  pages: number
}

const Dasboard = ({ items, pages }: DashboardProps) => {
  return (
    <>
      <ul className="games-list">
        {items.map((item) => (
          <li key={item.variant.gameId}>
            <DashboardItem item={item.variant} />
          </li>
        ))}
      </ul>
      <Pagination pages={pages} />
    </>
  )
}

export default Dasboard