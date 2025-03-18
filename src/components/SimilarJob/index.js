import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBagFill} from 'react-icons/bs'
import './index.css'

const SimilarJob = props => {
  const {job} = props
  return (
    <li className="similar-job">
      <div className="similar-flex-title">
        <img
          className="similar-company-logo"
          src={job.companyLogoUrl}
          alt="similar job company logo"
        />
        <div>
          <h1 className="title-head">{job.title}</h1>
          <p>
            <FaStar className="icon" />
            {job.rating}
          </p>
        </div>
      </div>
      <div className="show-description">
        <h1 className="description-head">Description</h1>
        <p className="para-line">{job.jobDescription}</p>
      </div>
      <div className="similar-flex-details-div">
        <div className="similar-details">
          <p className="similar-icon">
            <MdLocationOn /> {job.location}
          </p>
          <p className="similar-icon">
            <BsBagFill /> {job.employmentType}
          </p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJob
