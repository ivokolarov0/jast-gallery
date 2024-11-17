import { useState } from 'react'
import { getDownloadLinks } from '../../requests'
import Loading from '../loading'

type ItemType = {
  "@type": string,
  "gameId": number,
  "gameLinkId": number,
  "label": string,
  "platforms": string[],
  "version": string
}


type DownloadBtnProps = {
  item: ItemType
}

const DownloadBtn = ({ item }: DownloadBtnProps) => {
  const [loading, setLoading] = useState(false)
  const [downloadLink, setDownloadLink] = useState<string | null>(null)
  const handleClick = async (gameId: number, gameLinkId: number) => {
    setLoading(true);
    const data = await getDownloadLinks({
      gameId,
      gameLinkId
    })

    const link = data?.[0]?.url;
    setDownloadLink(link);
    setLoading(false);
  }

  if(loading) {
    return <Loading />
  }

  return (
    <>
      <h5>
      {item.label} - {item.platforms.map((platform: string) => <small key={platform}>{platform}</small>)}
      </h5>
      {
        downloadLink 
          ? 
            <a className="btn" target='_blank' href={downloadLink} download>Download</a> 
          :
            <button
              type="button"
              className='btn'
              onClick={() => handleClick(item.gameId, item.gameLinkId)}
            >
              Request download link
            </button>
      }
      
    </>
  )
}

export default DownloadBtn