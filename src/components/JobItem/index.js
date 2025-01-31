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
    <Link to={`/jobs/${id}`}>
      <li className="link">
        <div className="job">
          <div className="flexTitle">
            <img
              className="companyLogo"
              src={companyLogoUrl}
              alt="company logo"
            />
            <div className="title">
              <h1>{title}</h1>
              <div className="flexRow">
                <FaStar className="icon" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="flexDetails">
            <div className="details">
              <div className="flexRow">
                <MdLocationOn className="icon" />
                <p>{location}</p>
              </div>
              <div className="flexRow">
                <BsBagFill className="icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="description">
            <h1>Description</h1>
            <p>{jobDescription}</p>
          </div>
        </div>
      </li>
    </Link>
  )
}

export default JobItem
