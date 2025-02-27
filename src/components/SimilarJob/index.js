import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBagFill} from 'react-icons/bs'
import './index.css'

const SimilarJob = props => {
  const {job} = props
  return (
    <li>
      <div className="similar-div">
        <div className="similar-flex-title">
          <img
            className="company-logo"
            src={job.companyLogoUrl}
            alt="similar job company logo"
          />
          <div className="title">
            <h2 className="heading">{job.title}</h2>
            <div className="flex-title">
              <FaStar className="icon" />
              <p>{job.rating}</p>
            </div>
          </div>
        </div>
        <div>
          <h1>Description</h1>
          <p className="para-line">{job.jobDescription}</p>
        </div>
        <div className="flex-details">
          <div className="details">
            <p className="icon">
              <MdLocationOn /> {job.location}
            </p>
            <p className="icon">
              <BsBagFill />
              {job.employmentType}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJob
