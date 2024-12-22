import DOMPurify from 'dompurify';
import Download from '@components/download/download';
import { Product, ProductImage } from '@requests/get-game';
import { jastMedia } from '@utils/index'

type PropTypes = {
  data: Product;
  page: string;
  search: string;
}

const GameSidebar = ({ data, page, search }: PropTypes) => {
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
            Adults Only<br /> 
            Mature Content
          </div>
        </div>
      )}

      <hr />

      <Download id={data.code} page={page} search={search} />
    </div>
  )
}

export default GameSidebar