import { Link } from '@tanstack/react-router'
import Logo from '@assets/images/logo.svg'
import Logout from '@components/logout'

const Header = ({ logged }: {logged: boolean}) => {
  return (
    <div className="header">
      <div className="shell shell--full">
        <div className="header__inner">
          <Link to="/" className="logo">
            <img src={Logo} alt="" />
          </Link>
          <nav className="main-nav">
            <ul>
              {logged ? (
                <>
                  <li>
                    <Link to="/account">My games</Link>
                  </li>
                  <li>
                    <Link to="/settings/security">Settings</Link>
                  </li>
                  <li className="side-link">
                    <Logout />
                  </li>
                </>
              )
              : <li className="side-link">
                  <Link to="/login">Login</Link>
                </li>  
              }
              
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Header