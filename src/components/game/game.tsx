import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useTranslation } from 'react-i18next';

import useGetGame from '@hooks/use-get-game';
import BackBtn from '@components/back-btn'
import GameInfo from '@components/game-info/game-info'
import Drawer from '@components/drawer/drawer';
import useDrawer from '@components/drawer/use-drawer';
import StatusTags from '@components/status-tags/status-tags';
import GameVideo from './game-video';
import GameImages from './game-images';
import GameSidebar from './game-sidebar';
import GameLoader from './game-loader';
import { isGameSynced } from '@requests/db';
import GameVndb from './game-vndb';

type GameProps = {
  page: string;
  search: string;
  id: string;
}

const Game = ({ id }:GameProps) => {
  const { t } = useTranslation();
  const { data } = useGetGame({ id });
  const { isOpen, handleClose, handleOpen }= useDrawer();
  const response = data?.[0];
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);
 
  useEffect(() => {
    (async () => {
      try {
        const isSynced = await isGameSynced(id);
        setSynced(Boolean(isSynced));
      } catch {}
    })();
  }, [id]);

  const extractEnglishTags = (attributes: any[] | undefined) => {
    if (!Array.isArray(attributes)) return [] as { key: string; title: string }[];
    const tagAttr: any = attributes.find(a => a?.code === 'tag' && a?.localeCode === 'en_US');
    if (!tagAttr) return [] as { key: string; title: string }[];

    const choices = (tagAttr?.configuration?.choices) || {};
    const toKeys = (v: any): string[] => {
      if (!v) return [];
      if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string' && !!x);
      if (typeof v === 'string') return [v];
      if (typeof v === 'object') {
        const inner = (v as any).value;
        if (Array.isArray(inner) || typeof inner === 'string') return toKeys(inner);
      }
      return [];
    };

    const keys = toKeys(tagAttr?.value);
    return keys.map((key: string) => {
      const c = (choices as any)?.[key];
      const title = typeof c === 'string' ? c : (c?.en_US ?? key);
      return { key, title };
    });
  };

  const handleSync = async () => {
    if (!response) return;
    setSyncing(true);
    try {
      const tags = extractEnglishTags(response.attributes);

      const getImageUrl = (x: any): string | null => {
        if (!x) return null;
        if (typeof x === 'string') return x;
        return x.url || x.src || x.image || x.path || x.original || null;
      };
      const rawImages = (response as any).images ?? [];
      const gallery_images = Array.isArray(rawImages)
        ? (rawImages.map(getImageUrl).filter((s: any): s is string => typeof s === 'string' && !!s))
        : [];

      const cover_image = (
        (response as any).product_image ||
        (response as any).productImage ||
        (response as any).cover ||
        (response as any).thumbnail ||
        gallery_images[0] ||
        null
      ) as string | null;

      const product_code = ((response as any).product_code || (response as any).productCode || null) as string | null;
      const vndb_id = ((response as any).vndb_id || (response as any).vndbId || null) as string | null;
      const features = ((response as any).features || null) as any;

      const payload = {
        jast_id: id,
        name: response.name,
        description: response.description || null,
        release_date: response.releaseDate || null,
        cover_image,
        gallery_images,
        product_code,
        vndb_id,
        features,
        tags,
      };
      const created = await invoke<boolean>('save_game_if_missing', { payload: JSON.stringify(payload) });
      if (created || created === false) setSynced(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  if (!response) {
    return <GameLoader />
  }

  const descriptionSanitize = DOMPurify.sanitize(response?.description || '');
  const date = response?.releaseDate ? new Date(response?.releaseDate).toLocaleDateString('en-US',{
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  return (
    <div className="game-entry">
      <div className="game-entry__top">
        <BackBtn />
        {synced ? (
          <span className="badge" title="Synced to DB">Synced</span>
        ) : (
          <button type="button" className="btn" disabled={syncing} onClick={handleSync}>
            {syncing ? 'Syncing…' : 'Sync to DB'}
          </button>
        )}
        <button
          type="button"
          className="btn btn--empty"
          onClick={handleOpen}
        >{t('options')}</button>
        <Drawer open={isOpen} handleClose={handleClose}>
          <StatusTags response={response} />
          <hr />
          <GameVndb 
            id={id}
            synced={synced}
          />
        </Drawer>
        
      </div>
      <div className="game-entry__header">
        <h2>{response.name}</h2>
      </div>
      <div className="game-entry__inner">
        <div className="game-entry__col game-entry__col--main">
          <GameImages data={response} />
          <GameVideo data={response} />
          <div
            className="game-entry__desc"
            dangerouslySetInnerHTML={{ __html: descriptionSanitize }}
          />
          {response?.releaseDate && (
            <div className="details-wrapper">
              <h5>{t('release-date')}</h5>
              <div className="details">{date}</div>
            </div>
          )}
          {response?.attributes && <GameInfo attributes={response?.attributes} />}
        </div>
        <GameSidebar data={response} synced={synced} />
      </div>
    </div>
  )
}

export default Game