import { useRef, MutableRefObject, useState } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';

import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import SearchFormFilters from './search-form-filters';

const SearchForm = () => {
  const { t } = useTranslation();
  const { search } = useSearch<any>({ from: '/account'});
  const searchRef = useRef<HTMLInputElement | null>(null) as MutableRefObject<HTMLInputElement | null>;
  const navigate = useNavigate({ from: '/account' });
  const [showFilters, setShowFilters] = useState<boolean>(false);
 
  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    navigate({ search: { page: 1, search: e.target.value } });
  }, 500);

  const handleReset = () => {
    navigate({ search: { page: 1, search: '' } });
    if(searchRef.current) {
      searchRef.current.value = '';
    }
  }

  const handleFilters = () => {
    setShowFilters(!showFilters);
  }

  return (
    <div className="search-wrapper">
      <form className="search-form">
        <div className="search-form__top">
          <input
            type="text"
            defaultValue={search || ''}
            placeholder={t('search') + '...'}
            onChange={handleChange}
            ref={searchRef}
          />
          {search && <button type="reset" className="search-form__reset" onClick={handleReset}></button>}
        </div>
        <button type="button" className="search-filter" onClick={handleFilters}>{showFilters ? t('hide-filter') : t('show-filter')}</button>
      </form>
      {showFilters && <SearchFormFilters />}
    </div>
  )
}

export default SearchForm