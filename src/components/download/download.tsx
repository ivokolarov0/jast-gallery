import { useQuery } from "@tanstack/react-query"
import { getPaginatedGames, getTranslations } from "../../requests"
import { useState } from "react"
import DownloadBtn from "./download-btn";
import Loading from "../loading";

const Download = ({ id, page, search }: {id: string, page: string, search: string}) => {
  const [enabled, setEnabled] = useState(false);
  const { data: games, isLoading: pageLoading } = useQuery({
    queryKey: ['searched-games', page, search],
    queryFn: ({ queryKey }) =>
      getPaginatedGames(queryKey[1] as string, queryKey[2] as string),
    enabled: !!enabled
  })
  const requestID = games?.[0]?.products.find((game: any) => game.variant.productCode === id)?.variant?.game?.translations?.en_US?.id;

  const { data: gameIDs, isLoading: translationLoading } = useQuery({
    queryKey: ['translations', requestID],
    queryFn: ({ queryKey }) => getTranslations(queryKey[1]),
    enabled: !!requestID && !!enabled,
  })
  const gameIdItems = gameIDs?.[0]?.gamePathLinks;

  const isLoading = pageLoading || translationLoading

  const handleClick = () => {
    setEnabled(true)
  }

  if(isLoading) {
    return <Loading />
  }

  if(enabled && gameIdItems) {
    return (
      <>
        {gameIdItems.map((item: any) => <DownloadBtn key={item.gameLinkId} item={item} />)}
      </>
    )
  }

  return (
    <button type="button" className="btn full" onClick={handleClick}>Show Download Links</button>
  )
}

export default Download