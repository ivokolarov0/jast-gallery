import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGameVndbId, setGameVndbId } from '@requests/db';

export default function useGameVndb(id: string, enabled: boolean) {
  const qc = useQueryClient();
  const key = ['game-vndb', id] as const;

  const { data, isLoading } = useQuery({
    queryKey: key,
    enabled,
    queryFn: () => getGameVndbId(id),
  });

  const mutation = useMutation({
    mutationFn: (value: string | null) => setGameVndbId(id, value),
    onSuccess: (_, value) => {
      qc.setQueryData(key, value);
    },
  });

  return {
    vndbId: data ?? '',
    isLoading,
    save: (value: string | null) => mutation.mutateAsync(value),
    saving: mutation.isPending,
  };
}
