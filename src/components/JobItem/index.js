import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBagFill} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {job} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = job
  return (
    <Link to={`/jobs/${id}`} className="link-style">
      <li className="job-item-list-item">
        <div className="job-item-div">
          <div className="flex-title">
            <img
              className="job-item-company-logo"
              src={companyLogoUrl}
              alt="company logo"
            />
            <div>
              <h2 style={{margin: '5px'}}>{title}</h2>
              <div className="flex-row">
                <p>
                  <FaStar className="icon" fill="gold" />
                  {rating}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-details">
            <div className="job-and-location">
              <div className="location">
                <p>
                  <MdLocationOn className="icon" />
                  {location}
                </p>
              </div>
              <div className="job-type">
                <p>
                  <BsBagFill className="icon" />
                  {employmentType}
                </p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="description">
            <h1 className="description-head">Description</h1>
            <p>{jobDescription}</p>
          </div>
        </div>
      </li>
    </Link>
  )
}

export default JobItem
