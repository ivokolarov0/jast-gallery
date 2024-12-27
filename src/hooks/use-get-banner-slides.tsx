import { keepPreviousData, useQuery } from '@tanstack/react-query';
import getBannerSlides from '@requests/get-website-banner';

const useGetBannerSlides = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['website'],
    placeholderData: keepPreviousData,
    queryFn: () => getBannerSlides(),
  });

  return { data, isLoading }
}

export default useGetBannerSlides;