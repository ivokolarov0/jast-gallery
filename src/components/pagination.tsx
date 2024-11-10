import React from 'react'
import { useGlobalProvider } from '../contexts/global';

const Pagination = ({ pages }: { pages: number}) => {
  const { page, setPage } = useGlobalProvider();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, i: number) => { 
    e.preventDefault(); 
    setPage(i+1);
  }

  return (
    <ul className="pagination">
      {Array.from({ length: pages }, (_, i) => (
        <li key={i + 1} className={page === i + 1 ? 'is-active' : ''}>
          <a href="#" onClick={(e) => handleClick(e, i)}>{i + 1}</a>
        </li>
      ))}
    </ul>
  )
}

export default Pagination