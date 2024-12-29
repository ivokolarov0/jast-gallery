import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

import { jastMedia } from '@utils/index'
import { Product, ProductImage } from '@requests/get-game';
import Download from '@components/download/download';

type PropTypes = {
  data: Product;
}

const GameSidebar = ({ data }: PropTypes) => {
  const { t } = useTranslation();
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