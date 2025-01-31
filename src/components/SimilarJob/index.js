import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBagFill} from 'react-icons/bs'
import './index.css'

const SimilarJob = props => {
  const {job} = props
  return (
    <li>
      <div className="similarDiv">
        <div className="flexTitle">
          <img
            className="companyLogo"
            src={job.companyLogoUrl}
            alt="similar job company logo"
          />
          <div className="title">
            <h1 className="heading">{job.title}</h1>
            <div className="flexTitle">
              <FaStar className="icon" />
              <p>{job.rating}</p>
            </div>
          </div>
        </div>
        <div>
          <h1>Description</h1>
          <p>{job.jobDescription}</p>
        </div>
        <div className="flexDetails">
          <div className="details">
            <p>
              <MdLocationOn /> {job.location}
            </p>
            <p>
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
