import getMe from '@requests/get-me';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const useGetMe = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    placeholderData: keepPreviousData,
    queryFn: () => getMe(),
  });

  return { data, isLoading }
}

export default useGetMe