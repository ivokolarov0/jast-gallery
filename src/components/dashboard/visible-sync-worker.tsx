import { useEffect } from 'react';
import useGetGame from '@hooks/use-get-game';
import { invoke } from '@tauri-apps/api/core';

type Props = {
  id: string;
  onDone: (ok: boolean) => void;
};

const VisibleSyncWorker = ({ id, onDone }: Props) => {
  const { data } = useGetGame({ id });
  const response = data?.[0];

  useEffect(() => {
    (async () => {
      if (!response) return;
      try {
        const attributes = response.attributes;
        const tagAttr: any = Array.isArray(attributes) ? attributes.find(a => a?.code === 'tag' && a?.localeCode === 'en_US') : null;
        const choices = (tagAttr?.configuration?.choices) || {};
        const rawVal = tagAttr?.value;
        const keys: string[] = Array.isArray(rawVal) ? rawVal : (typeof rawVal === 'string' ? [rawVal] : []);
        const tags = keys.map((key: string) => ({ key, title: choices?.[key]?.en_US || key }));

        const payload = {
          jast_id: id,
          name: response.name,
          description: response.description || null,
          release_date: response.releaseDate || null,
          cover_image: (response as any).productImage || (response as any).product_image || null,
          gallery_images: (((response as any).images || []) as any[]).map((x: any) => x?.url || x?.src || x?.image || x?.path || x?.original).filter(Boolean),
          product_code: (response as any).productCode || null,
          vndb_id: (response as any).vndbId || null,
          features: (response as any).features || null,
          tags,
        };
        const created = await invoke<boolean>('save_game_if_missing', { payload: JSON.stringify(payload) });
        onDone(Boolean(created) || created === false);
      } catch {
        onDone(false);
      }
    })();
  }, [response, id, onDone]);

  return null;
};

export default VisibleSyncWorker;
