import { useState } from "react"
import { useSearch } from "@tanstack/react-router";

import { GameLink } from "@requests/get-translations"
import Loading from '@components/loading';
import DownloadBtn from "./download-btn";
import useGetTranslations from "@hooks/use-get-translations";

const Download = () => {
  const [enabled, setEnabled] = useState(false);
  const { translationId } = useSearch({ from: '/game/$id' }) as { translationId: string }
  const { data: gameIDs, isLoading } = useGetTranslations({ translationId, enabled });
  const gameIdItems = gameIDs?.[0]?.gamePathLinks;

  const handleClick = () => setEnabled(true);

  if(isLoading) {
    return <Loading />
  }

  if(enabled && gameIdItems) {
    return (
      <>
        {gameIdItems.map((item: GameLink) => <DownloadBtn key={item.gameLinkId} item={item} />)}
      </>
    )
  }

  return (
    <button type="button" className="btn full" onClick={handleClick}>Show Download Links</button>
  )
}

export default Download