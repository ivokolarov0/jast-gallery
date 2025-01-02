import { useRef } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';

import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';

const SearchForm = () => {
  const { t } = useTranslation();
  const { search } = useSearch<any>({ from: '/account'});
  const navigate = useNavigate({ from: '/account' })
  const input = useRef<HTMLInputElement>(null);

  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    navigate({ search: { page: 1, search: e.target.value } });
  }, 500);

  const handleReset = () => {
    navigate({ search: { page: 1, search: '' } });
    if(input.current) {
      input.current.value = '';
    }
  }

  return (
    <form className="search-form">
      <div className="search-form__top">
        <input
          ref={input}
          type="text"
          defaultValue={search || ''}
          placeholder={t('search') + '...'}
          onChange={handleChange}
        />
        {search && <button type="reset" className="search-form__reset" onClick={handleReset}></button>}
      </div>
    </form>
  )
}

export default SearchForm