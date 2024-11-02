import { Link } from '@tanstack/react-router'
import { base } from '../../requests'
import { useGlobalProvider } from '../../contexts/global'

const DashboardItem = ({item}: any) => {
  const {page, search} = useGlobalProvider() as {
    page: string,
    search: string
  }
  const imagePath = base + '/300/450/resize/' + item.productImage;

  return (
    <div className="game-box">
      <Link to={`/game/${item.productCode}?page=${page}&search=${search}`} className="game-box__link">
        <div className="game-box__image">
          <img src={imagePath} alt="" />
        </div>
      </Link>
      <div className="game-box__details">
        <h5>{item.productName}</h5>
        {item.userGameTags.length > 0 && <div className="game-box__tags">
          {item.userGameTags.map((tag: any) => (
            <span key={tag['@id']} className={`tag tag--${tag.type}`}>{tag.type}</span>
          ))}
        </div>}
      </div>
    </div>
  )
}

export default DashboardItem