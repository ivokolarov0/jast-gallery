import Dashboard from '@components/dashboard/dashboard';
import SearchForm from '@components/search-form';
import AccountLoader from './account-loader';
import useGetPaginatedGames from '@hooks/use-get-paginated-games';

const Account = () => {
  const { data, isLoading } = useGetPaginatedGames('/account');
  const item = data?.[0];

  return (
    <>
      <SearchForm />
      {isLoading ? <AccountLoader /> : item?.['@id'] && <Dashboard items={item.products} pages={item.pages} />}
    </>
  );
};

export default Account;