import { useState, useCallback } from "react"
import { useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { GameLink } from "@requests/get-translations"
import useGetTranslations from "@hooks/use-get-translations";
import Loading from '@components/loading';
import DownloadBtn from "./download-btn";

const Download = () => {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const { translationId } = useSearch({ from: '/game/$id' }) as { translationId: string }
  const { data: gameIDs, isLoading } = useGetTranslations({ translationId, enabled });
  const gameIdItems = gameIDs?.[0]?.gamePathLinks;

  const handleClick = useCallback(() => setEnabled(true), []);

  if (isLoading) {
    return <Loading />
  }

  if (enabled && gameIdItems) {
    return (
      <>
        {gameIdItems.map((item: GameLink) => (
          <DownloadBtn key={item.gameLinkId} item={item} />
        ))}
      </>
    )
  }

  return (
    <button type="button" className="btn full" onClick={handleClick}>
      {t('show-download-links')}
    </button>
  )
}

export default Download