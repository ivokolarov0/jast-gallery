import { useGlobalProvider } from '@contexts/global';
import { debounce } from '@utils/index';
import { useRef } from 'react';

const SearchForm = () => {
  const { setSearch, search, setPage } = useGlobalProvider();
  const input = useRef<HTMLInputElement>(null);

  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, 500);

  const handleReset = () => {
    setSearch('');
    setPage(1);
    if(input.current) {
      input.current.value = '';
    }
  }

  return (
    <form className="search-form">
      <input
        ref={input}
        type="text"
        defaultValue={search}
        placeholder="Search..."
        onChange={handleChange}
      />
      {search && <button type="reset" className="search-form__reset" onClick={handleReset}></button>}
    </form>
  )
}

export default SearchForm