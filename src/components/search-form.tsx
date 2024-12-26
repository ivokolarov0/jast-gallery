import { useRef } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';

import { debounce } from '@utils/index';

const SearchForm = () => {
  const { page, search } = useSearch<any>({ from: '/account'});
  const navigate = useNavigate({ from: '/account' })
  const input = useRef<HTMLInputElement>(null);

  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    navigate({ search: { page: page, search: e.target.value } });
  }, 500);

  const handleReset = () => {
    navigate({ search: { page: 1, search: '' } });
    if(input.current) {
      input.current.value = '';
    }
  }

  return (
    <form className="search-form">
      <input
        ref={input}
        type="text"
        defaultValue={search || ''}
        placeholder="Search..."
        onChange={handleChange}
      />
      {search && <button type="reset" className="search-form__reset" onClick={handleReset}></button>}
    </form>
  )
}

export default SearchForm