import './index.css'

const FailureView = props => {
  const {retryJobs} = props
  const clickRetry = () => {
    retryJobs()
  }
  return (
    <div className="failure-div">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <div className="retry-div">
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button type="button" onClick={clickRetry} className="retry-button">
          Retry
        </button>
      </div>
    </div>
  )
}
export default FailureView
