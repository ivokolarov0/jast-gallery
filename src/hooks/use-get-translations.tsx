import getTranslations from '@requests/get-translations'
import { useQuery } from '@tanstack/react-query'

type PropType = {
  translationId: string;
  enabled: boolean;
}

const useGetTranslations = ({ translationId, enabled }: PropType) => {
  const { data, isLoading } = useQuery({
    queryKey: ['translations', translationId],
    queryFn: ({ queryKey }) => getTranslations(queryKey[1]),
    enabled: !!translationId && !!enabled,
  })

  return { data, isLoading }
}

export default useGetTranslations