import { Link, useSearch } from '@tanstack/react-router';
import classNames from 'classnames';

type SearchType = {
  page: string;
  search: string;
  userGameTags: string;
  attributes: string;
  taxons: string;
}

const Pagination = ({ pages }: { pages: number}) => {
  const { page, search, userGameTags,attributes, taxons } = useSearch({ from: '/account' }) as SearchType;
  return (
    <ul className="pagination">
      {Array.from({ length: pages }, (_, i) => (
        <li key={i + 1}>
          <Link to={`/account`} className={classNames({'active': !page && i == 0 })} search={{
            page: i + 1,
            search,
            userGameTags,
            attributes,
            taxons
          }}>{i + 1}</Link>
        </li>
      ))}
    </ul>
  )
}

export default Pagination