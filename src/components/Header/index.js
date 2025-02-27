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
    <nav className="navbar">
      <ul className="links-list">
        <Link to="/">
          <li className="home-logo-div">
            <img
              className="home-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </li>
        </Link>
        <li className="page-links-div">
          <Link to="/" className="page-link">
            <p>Home</p>
          </Link>
          <Link to="/jobs" className="page-link">
            <p>Jobs</p>
          </Link>
        </li>
        <li>
          <button className="logout-button" type="button" onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
