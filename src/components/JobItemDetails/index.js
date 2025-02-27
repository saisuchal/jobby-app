import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBagFill} from 'react-icons/bs'
import Header from '../Header'
import FailureView from '../FailureView'
import SimilarJob from '../SimilarJob'
import './index.css'

class JobItemDetails extends Component {
  state = {
    isLoading: true,
    formattedJobDetails: [],
    formattedSimilarJobs: [],
    failure: false,
  }

  componentDidMount() {
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    console.log('fetching job details')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const {jobDetails, similarJobs} = this.formatJob(data)
      const formattedJobDetails = this.formatJobDetails(jobDetails)
      const formattedSimilarJobs = this.formatSimilarJobs(similarJobs)
      this.setState({
        isLoading: false,
        formattedJobDetails,
        formattedSimilarJobs,
        failure: false,
      })
    } else {
      this.setState({isLoading: false, failure: true})
    }
  }

  formatJob = job => ({
    jobDetails: job.job_details,
    similarJobs: job.similar_jobs,
  })

  formatJobDetails = jobDetails => {
    const skills = this.skillsCamelCase(jobDetails.skills)
    const lifeAtCompany = this.lifeCamelCase(jobDetails.life_at_company)
    return {
      companyLogoUrl: jobDetails.company_logo_url,
      companyWebsiteUrl: jobDetails.company_website_url,
      employmentType: jobDetails.employment_type,
      id: jobDetails.id,
      jobDescription: jobDetails.job_description,
      skills,
      lifeAtCompany,
      location: jobDetails.location,
      packagePerAnnum: jobDetails.package_per_annum,
      rating: jobDetails.rating,
      title: jobDetails.title,
    }
  }

  formatSimilarJobs = similarJobs =>
    similarJobs.map(similarJob => ({
      companyLogoUrl: similarJob.company_logo_url,
      employmentType: similarJob.employment_type,
      id: similarJob.id,
      jobDescription: similarJob.job_description,
      location: similarJob.location,
      rating: similarJob.rating,
      title: similarJob.title,
    }))

  skillsCamelCase = skills =>
    skills.map(skill => ({
      imageUrl: skill.image_url,
      name: skill.name,
    }))

  lifeCamelCase = life => ({
    description: life.description,
    imageUrl: life.image_url,
  })

  retryJobs = () => {
    this.setState({isLoading: true, failure: false}, this.fetchJobDetails)
  }

  jobItemDetails = () => {
    const {formattedJobDetails, formattedSimilarJobs, failure} = this.state
    const fetchSuccess =
      formattedJobDetails.length !== 0 && formattedSimilarJobs.length !== 0
    if (failure) {
      return <FailureView retryJobs={this.retryJobs} />
    }
    return (
      fetchSuccess && (
        <div className="job-details-bg">
          <div className="flex-title">
            <img
              className="company-logo"
              src={formattedJobDetails.companyLogoUrl}
              alt="job details company logo"
            />
            <div>
              <h1 className="job-details-heading" style={{marginTop: '5px'}}>
                {formattedJobDetails.title}
              </h1>
              <p>
                <FaStar className="icon" fill="gold" />
                {formattedJobDetails.rating}
              </p>
            </div>
          </div>
          <div className="flex-details">
            <div className="job-and-location">
              <div className="location">
                <p>
                  <MdLocationOn className="icon" />
                  {formattedJobDetails.location}
                </p>
              </div>
              <div className="job-type">
                <p>
                  <BsBagFill className="icon" />
                  {formattedJobDetails.employmentType}
                </p>
              </div>
            </div>
            <p>{formattedJobDetails.packagePerAnnum}</p>
          </div>
          <hr />
          <div className="description">
            <div className="description-head">
              <h2>Description</h2>
              <a
                className="company-hyperlink"
                href={formattedJobDetails.companyWebsiteUrl}
              >
                Visit
                <FaExternalLinkAlt />
              </a>
            </div>
            <p className="para-line">{formattedJobDetails.jobDescription}</p>
          </div>
          <h3>Skills</h3>
          <ul className="list-row">
            {formattedJobDetails.skills.map(skill => (
              <li key={`skill-${skill.name}`} className="list-item">
                <img src={skill.imageUrl} alt={skill.name} />
                <p>{skill.name}</p>
              </li>
            ))}
          </ul>
          <div className="flex-title">
            <div>
              <h3>Life at Company</h3>
              <p className="para-line">
                {formattedJobDetails.lifeAtCompany.description}
              </p>
            </div>
            <div>
              <img
                src={formattedJobDetails.lifeAtCompany.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
          <h1>Similar Jobs</h1>
          <ul className="similar-jobs">
            {formattedSimilarJobs.map(job => (
              <SimilarJob job={job} key={`similar-${job.id}`} />
            ))}
          </ul>
        </div>
      )
    )
  }

  render() {
    const {isLoading} = this.state
    const loader = (
      <div data-testid="loader">
        <Loader
          color="white"
          type="ThreeDots"
          className="details-loader-container"
        />
      </div>
    )
    return (
      <div className="job-item-details-div">
        <Header />
        {isLoading ? loader : this.jobItemDetails()}
      </div>
    )
  }
}

export default JobItemDetails
