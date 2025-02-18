import { useTranslation } from 'react-i18next'
import { Link, useSearch } from '@tanstack/react-router'

import Logo from '@assets/images/logo.svg'
import Logout from '@components/logout'


const Header = ({ logged }: {logged: boolean}) => {
  const { forgot }: { forgot: boolean } = useSearch({ strict: false });
  const { t } = useTranslation();

  if(forgot) {
    return null;
  }

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
                    <Link to="/account">
                      {t('header.my-games')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings/security">
                      {t('header.settings')}
                    </Link>
                  </li>
                  <li className="side-link">
                    <Logout />
                  </li>
                </>
              )
              : <li className="side-link">
                  <Link to="/login">
                    {t('header.login')}
                  </Link>
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