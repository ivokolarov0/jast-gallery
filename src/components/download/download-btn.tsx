import { useState } from 'react'
import ContentLoader from 'react-content-loader';

import getDownloadLinks from '@requests/get-download-links'
import { GameLink } from '@requests/get-translations';

type DownloadBtnProps = {
  item: GameLink
}

const Loader = () => (
  <ContentLoader
    viewBox="0 0 163 53"
    width={163}
    height={53}
    speed={1}
    backgroundColor={'var(--c-border)'}
    foregroundColor={'var(--c-blue)'}
  >
    <rect x="0" y="0" rx="5" ry="5" width="163" height="53" />
  </ContentLoader>
)

const Btn = ({ item }: DownloadBtnProps) => {
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
    return <Loader />
  }

  if(downloadLink) {
    return <a className="btn" target='_blank' href={downloadLink} download>Download</a>
  }

  return (
    <button
      type="button"
      className='btn'
      onClick={() => handleClick(item.gameId, item.gameLinkId)}
    >
      Request download link
    </button>
  )
}

const DownloadBtn = ({ item }: DownloadBtnProps) => {
  return (
    <div className="game-entry__download">
      <h5>
      {item.label} - {item.platforms.map((platform: string) => <small key={platform}>{platform}</small>)}
      </h5>
      <Btn item={item} />
    </div>
  )
}

export default DownloadBtn