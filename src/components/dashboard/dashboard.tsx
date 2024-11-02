import Pagination from '../pagination';
import DashboardItem from './dashboard-item';

interface DashboardProps {
  items: any[];
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