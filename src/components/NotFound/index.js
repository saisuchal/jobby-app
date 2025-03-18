import {withRouter} from 'react-router-dom'
import './index.css'

const NotFound = props => {
  const {history} = props
  const {location} = history
  const {pathname} = location
  if (pathname !== '/not-found') {
    history.push('/not-found')
  }
  const backToHome = () => {
    history.replace('/')
  }
  return (
    <div className="not-found">
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
      />
      <h1>Page Not Found</h1>
      <p>We are sorry, the page you requested could not be found</p>
      <button
        type="button"
        className="back-to-home-button"
        onClick={backToHome}
      >
        Go Back To Home Page
      </button>
    </div>
  )
}

export default withRouter(NotFound)
