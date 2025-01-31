import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBagFill} from 'react-icons/bs'
import Header from '../Header'
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
    console.log(this.props)
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      const url = `https://apis.ccbp.in/jobs/${id}`
      console.log(url)
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const {jobDetails, similarJobs} = this.formatJob(data)
        const formattedJobDetails = this.formatJobDetails(jobDetails)
        const formattedSimilarJobs = this.formatSimilarJobs(similarJobs)
        this.setState({
          isLoading: false,
          formattedJobDetails,
          formattedSimilarJobs,
          failure: false,
        })
        return 'success'
      }
      this.setState({failure: true})
      return 'failure'
    }
    return 'no token'
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

  jobItemDetails = () => {
    const {formattedJobDetails, formattedSimilarJobs} = this.state
    console.log(formattedJobDetails.title)
    if (formattedJobDetails !== [] && formattedSimilarJobs !== []) {
      const {skills, lifeAtCompany} = formattedJobDetails
      return (
        <div>
          <Header />
          <div className="jobItemDetails">
            <div className="flexTitle">
              <img
                className="companyLogo"
                src={formattedJobDetails.companyLogoUrl}
                alt="job details company logo"
              />
              <h1>{formattedJobDetails.title}</h1>
              <p>
                {' '}
                <FaStar />
                {formattedJobDetails.rating}
              </p>
            </div>
            <div className="flexDetails">
              <div className="details">
                <p>
                  <MdLocationOn /> {formattedJobDetails.location}
                </p>
                <p>
                  <BsBagFill />
                  {formattedJobDetails.employmentType}
                </p>
              </div>
              <p>{formattedJobDetails.packagePerAnnum}</p>
            </div>
            <hr />
            <div className="description">
              <div className="descriptionHead">
                <h1>Description</h1>
                <a
                  className="hyperlink"
                  href={formattedJobDetails.companyWebsiteUrl}
                >
                  Visit
                  <FaExternalLinkAlt />
                </a>
              </div>
              <p>{formattedJobDetails.jobDescription}</p>
            </div>
            <h1>Skills</h1>
            <ul className="listRow">
              {skills.map(skill => (
                <li key={skill.name} className="listItem">
                  <img src={skill.imageUrl} alt={skill.name} />
                  <p>{skill.name}</p>
                </li>
              ))}
            </ul>
            <div className="flexTitle">
              <div>
                <h1>Life at Company</h1>
                <p>{lifeAtCompany.description}</p>
              </div>
              <div>
                <img src={lifeAtCompany.imageUrl} alt="life at company" />
              </div>
            </div>
            <h1>Similar Jobs</h1>
            <ul className="similarjobs">
              {formattedSimilarJobs.map(job => (
                <SimilarJob job={job} key={job.id} />
              ))}
            </ul>
          </div>
        </div>
      )
    }
    return 'job item'
  }

  render() {
    const {isLoading, failure} = this.state

    const loader = (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
    if (failure === false && isLoading === false) {
      const jobDetails = this.jobItemDetails()
      return jobDetails
    }

    return loader
  }
}

export default JobItemDetails
