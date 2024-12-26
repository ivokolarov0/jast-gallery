import { Link } from '@tanstack/react-router';

const Pagination = ({ pages }: { pages: number}) => {
  return (
    <ul className="pagination">
      {Array.from({ length: pages }, (_, i) => (
        <li key={i + 1}>
          <Link to={`/account`} search={{
            page: i + 1
          }}>{i + 1}</Link>
        </li>
      ))}
    </ul>
  )
}

export default Pagination