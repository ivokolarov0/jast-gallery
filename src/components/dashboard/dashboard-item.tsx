import { Link } from '@tanstack/react-router'
import { base } from '../../requests'

const DashboardItem = ({item}: any) => {
  console.log(item)
  return (
    <div className="game-box">
      <Link to={`/game/${item.gameId}`} className="game-box__link">
        <div className="game-box__image">
          <img src={base + '/300/450/resize/' + item.productImage} alt="" />
        </div>
        <div className="game-box__details">
          <h4>{item.productName}</h4>
          {item.userGameTags.length > 0 && <div className="game-box__tags">
            {item.userGameTags.map((tag: any) => (
              <span key={tag['@id']} className={`tag tag--${tag.type}`}>{tag.type}</span>
            ))}
          </div>}
          
        </div>
      </Link>
    </div>
  )
}

export default DashboardItem