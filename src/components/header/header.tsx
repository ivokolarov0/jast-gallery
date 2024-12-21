import { Link } from '@tanstack/react-router'
import Logo from '@assets/images/logo.svg'
import Logout from '@components/logout'

const Header = () => {
  return (
    <div className="header">
      <div className="shell">
        <div className="header__inner">
          <Link to="/" className="logo">
            <img src={Logo} alt="" />
          </Link>
          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/account">Account</Link>
              </li>
              <li>
                <Logout />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Header