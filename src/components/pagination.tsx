import { Link, useSearch } from '@tanstack/react-router';
import classNames from 'classnames';

const Pagination = ({ pages }: { pages: number}) => {
  const { page } = useSearch({ from: '/account' }) as { page: string }
  return (
    <ul className="pagination">
      {Array.from({ length: pages }, (_, i) => (
        <li key={i + 1}>
          <Link to={`/account`} className={classNames({'active': !page && i == 0 })} search={{
            page: i + 1
          }}>{i + 1}</Link>
        </li>
      ))}
    </ul>
  )
}

export default Pagination