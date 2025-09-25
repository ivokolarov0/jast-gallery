import { useRef, MutableRefObject, useEffect, useState } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';

import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import SearchFormFilters from './search-form-filters';
import { DbTag, getDbTags } from '@requests/db';

const SearchForm = () => {
  const { t } = useTranslation();
  const { search, source, dbTags } = useSearch<any>({ from: '/account'});
  const searchRef = useRef<HTMLInputElement | null>(null) as MutableRefObject<HTMLInputElement | null>;
  const navigate = useNavigate({ from: '/account' });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [useDb, setUseDb] = useState<boolean>(source === 'db');
  const [tags, setTags] = useState<DbTag[]>([]);
  const selected = (dbTags || '').split(',').filter(Boolean);

  useEffect(() => {
    if (!useDb) return;
    (async () => {
      try {
        const t = await getDbTags();
        setTags(t);
      } catch {
        setTags([]);
      }
    })();
  }, [useDb]);

  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    navigate({ search: { page: 1, search: e.target.value, source: useDb ? 'db' : undefined, dbTags: useDb ? (selected.join(',')) : undefined } });
  }, 500);

  const handleReset = () => {
    navigate({ search: { page: 1, search: '' } });
    if(searchRef.current) searchRef.current.value = '';
    setUseDb(false);
  }

  const handleFilters = () => {
    setShowFilters(!showFilters);
  }

  const handleToggleDb = () => {
    const next = !useDb;
    setUseDb(next);
    navigate({ search: { page: 1, search: search || '', source: next ? 'db' : undefined, dbTags: next ? (selected.join(',')) : undefined } });
  };

  const toggleTag = (key: string) => {
    const set = new Set(selected);
    if (set.has(key)) set.delete(key); else set.add(key);
    navigate({ search: { page: 1, search: search || '', source: 'db', dbTags: Array.from(set).join(',') } });
  };

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
      {showFilters && (
        <SearchFormFilters hideFilters={useDb}>
          <div className="filter custom-checkbox search-form__db-toggle">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" checked={useDb} onChange={handleToggleDb} />
              <span></span>
              {t('Search local Database')}
            </label>
          </div>
          {
            useDb && <div className="db-tag-filter" style={{ marginTop: 8 }}>
              <div style={{ marginBottom: 6 }}>{t('Tags')}:</div>
              <div className="filter__items">
                {tags.map((tag) => (
                  <div className="custom-checkbox" key={tag.key}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selected.includes(tag.key)}
                        onChange={() => toggleTag(tag.key)}
                      />
                      <span></span>
                      {tag.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          }
        </SearchFormFilters>
      )}
    </div>
  )
}

export default SearchForm