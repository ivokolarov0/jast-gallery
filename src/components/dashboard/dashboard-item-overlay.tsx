import Windows from '@assets/images/icon-windows.svg';
import Linux from '@assets/images/icon-linux.svg';
import Apple from '@assets/images/icon-apple.svg';

type PropType = {
  platforms: Array<{ en_US: string }>
}

console.log(Linux)

const DashboardItemOverlay = ({ platforms }: PropType) => {
  const icons: { [key: string]: string } = {
    'Windows': Windows,
    'Mac': Apple,
    'Linux': Linux,
  }

  return (
    <div className="game-box__overlay">
      {platforms.map((platform, index) => (<div className="game-box__overlay-icon" key={index}><img src={icons[platform.en_US]} /></div>))}
    </div>
  )
}

export default DashboardItemOverlay