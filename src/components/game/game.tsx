import DOMPurify from 'dompurify';
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

  if (!response) {
    return <GameLoader />
  }

  const descriptionSanitize = DOMPurify.sanitize(response?.description);
  const date = response?.releaseDate ? new Date(response?.releaseDate).toLocaleDateString('en-US',{
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  return (
    <div className="game-entry">
      <div className="game-entry__top">
        <BackBtn />
        <button
          type="button"
          className="btn btn--empty"
          onClick={handleOpen}
        >{t('options')}</button>
        <Drawer open={isOpen} handleClose={handleClose}>
          <StatusTags response={response} />
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
        <GameSidebar data={response} />
      </div>
    </div>
  )
}

export default Game