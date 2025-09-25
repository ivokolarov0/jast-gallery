import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

import { jastMedia } from '@utils/index'
import { Product, ProductImage } from '@requests/get-game';
import useGameVndb from '@hooks/use-game-vndb';
import Download from '@components/download/download';

import JastLogo from '@assets/images/logo-jast.png';
import VNDBProfile from '@assets/images/vndb-profile.jpg';

type PropTypes = {
  data: Product;
  synced: boolean;
}

const GameSidebar = ({ data, synced }: PropTypes) => {
  const { t } = useTranslation();
  const { vndbId } = useGameVndb(data['code'], synced);
  const coverImage = data?.images?.find(
    (image: ProductImage) => image.type === 'TAIL_PACKAGE_THUMBNAIL_PRODUCT',
  )
  const shortDescriptionSanitize = DOMPurify.sanitize(data?.shortDescription);

  return (
    <div className="game-entry__col game-entry__col--right">
      {coverImage && (
        <div className="game-entry__cover">
          <img src={jastMedia + '/' + coverImage.path} />
        </div>
      )}
      <ul className="game-entry__websites">
        <li>
          <a href={`https://jastusa.com/games/${data.code}`} target="_blank" title="JastUSA">
            <img src={JastLogo} width="30" height="30" alt="JastUSA" />
          </a>
        </li>
        {
          vndbId && (
            <li>
              <a href={vndbId} target="_blank" title="VNDB">
                <img src={VNDBProfile} width="30" height="30" alt="VNDB" />
              </a>
            </li>
          )
        }
      </ul>
      <p
        dangerouslySetInnerHTML={{ __html: shortDescriptionSanitize }}
      />

      {data?.productESRB?.matureContent && (
        <div className="game-info__mature-hld">
          <div className="game-info__mature">
            {t('adults-only')}<br /> 
            {t('mature-content')}
          </div>
        </div>
      )}

      <hr />

      <Download />
    </div>
  )
}

export default GameSidebar