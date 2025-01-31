import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const logout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav>
      <li>
        <Link to="/">
          <img
            className="homeLogo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
      </li>
      <ul className="links">
        <Link to="/">
          <li>
            <p className="headerPara">Home</p>
          </li>
        </Link>
        <Link to="/jobs">
          <li>
            <p className="headerPara">Jobs</p>
          </li>
        </Link>
      </ul>
      <button className="logoutButton" type="button" onClick={logout}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
