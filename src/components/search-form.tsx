import { useGlobalProvider } from '../contexts/global';
import { debounce } from '../utils';

const SearchForm = () => {
  const { setSearch, search } = useGlobalProvider();

  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, 500);

  return (
    <form className="search-form">
      <input type="text" defaultValue={search} placeholder="Search..." onChange={handleChange} />
    </form>
  )
}

export default SearchForm