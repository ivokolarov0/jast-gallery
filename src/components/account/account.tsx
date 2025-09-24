import Dashboard from '@components/dashboard/dashboard';
import SearchForm from '@components/search-form/search-form';
import AccountLoader from './account-loader';
import useGetPaginatedGames from '@hooks/use-get-paginated-games';
import { useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { GameListItem, searchDbGamesPaged } from '@requests/db';

const Account = () => {
  const { data, isLoading } = useGetPaginatedGames('/account');
  const item = data?.[0];
  const { source, search, dbTags, page } = useSearch<any>({ from: '/account' });

  const [dbItems, setDbItems] = useState<GameListItem[]>([]);
  const [dbPages, setDbPages] = useState<number>(0);
  const [dbLoading, setDbLoading] = useState(false);

  useEffect(() => {
    if (source !== 'db') return;
    (async () => {
      setDbLoading(true);
      try {
        const tags = (dbTags || '').split(',').map((s: string) => s.trim()).filter(Boolean);
        const res = await searchDbGamesPaged(search || '', tags, Number(page) || 1, 20);
        setDbItems(res.items);
        setDbPages(res.pages);
      } catch {
        setDbItems([]);
        setDbPages(0);
      } finally {
        setDbLoading(false);
      }
    })();
  }, [source, search, dbTags, page]);

  if (source === 'db') {
    return (
      <>
        <SearchForm />
        {dbLoading ? <AccountLoader /> : <Dashboard items={[]} pages={dbPages} dbItems={dbItems} />}
      </>
    );
  }

  return (
    <>
      <SearchForm />
      {isLoading ? <AccountLoader /> : item?.['@id'] && <Dashboard items={item.products} pages={item.pages} />}
    </>
  );
};

export default Account;