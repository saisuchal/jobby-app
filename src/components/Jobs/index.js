import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FailureView from '../FailureView'
import SalaryFilters from '../SalaryFilters'
import EmploymentFilters from '../EmploymentFilters'
import JobItem from '../JobItem'
import './index.css'

class Jobs extends Component {
  state = {
    profileDetails: '',
    employmentFilter: [],
    salaryFilter: '1000000',
    searchInput: '',
    fetchedJobs: [],
    isLoading: true,
    isProfileLoading: false,
    noJobs: false,
    profileFailure: false,
    jobsFailure: false,
  }

  componentDidMount() {
    this.getProfile()
    this.fetchJobs()
  }

  getProfile = async () => {
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const {profileDetails} = this.dataCamelCase(data)
        this.setState({isProfileLoading: false, profileDetails})
        return 'profile success'
      }
      this.setState({isProfileLoading: false, profileFailure: true})
      return 'profile failure'
    }
    return 'login'
  }

  fetchJobs = async () => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      const url = this.formatUrl()
      console.log(url)
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const {jobs, total} = data
        const fetchedJobs = this.formatJobs(jobs)
        if (total === 0) {
          this.setState({isLoading: false, noJobs: true})
          return 'no jobs'
        }
        this.setState({isLoading: false, noJobs: false, fetchedJobs})
        return fetchedJobs
      }
      this.setState({isLoading: false, jobsFailure: true})
      return 'jobs failure'
    }
    return 'login'
  }

  formatJobs = jobs =>
    jobs.map(job => ({
      companyLogoUrl: job.company_logo_url,
      employmentType: job.employment_type,
      id: job.id,
      jobDescription: job.job_description,
      location: job.location,
      packagePerAnnum: job.package_per_annum,
      rating: job.rating,
      title: job.title,
    }))

  formatUrl = () => {
    const {salaryFilter, employmentFilter, searchInput} = this.state
    console.log(salaryFilter, employmentFilter, searchInput)
    const empString =
      employmentFilter.length > 0 ? employmentFilter.join(',') : ''
    return `https://apis.ccbp.in/jobs?employment_type=${empString}&minimum_package=${salaryFilter}&search=${searchInput}`
  }

  profileCamelCase = data => ({
    name: data.name,
    profileImageUrl: data.profile_image_url,
    shortBio: data.short_bio,
  })

  dataCamelCase = data => ({
    profileDetails: this.profileCamelCase(data.profile_details),
  })

  searchFilter = event => {
    const {value} = event.target
    this.setState({searchInput: value}, this.search)
  }

  search = () => {
    this.setState({isLoading: true}, this.fetchJobs)
  }

  salaryFilterUpdate = salary => {
    this.setState({salaryFilter: salary}, this.search)
  }

  employmentFilterUpdate = employment => {
    const {employmentFilter} = this.state
    if (employmentFilter.includes(employment)) {
      const index = employmentFilter.indexOf(employment)
      employmentFilter.splice(index, 1)
    } else {
      employmentFilter.push(employment)
    }
    this.setState({employmentFilter}, this.search)
  }

  retryJobs = () => {
    console.log('trying jobs')
    this.setState({isLoading: true, jobsFailure: false}, this.fetchJobs)
  }

  retryProfile = () => {
    console.log('trying profile')
    this.setState(
      {isProfileLoading: true, profileFailure: false},
      this.getProfile,
    )
  }

  jobsView = () => {
    const {noJobs, jobsFailure, fetchedJobs} = this.state
    const jobItemsView = jobsFailure ? (
      <FailureView retryJobs={this.retryJobs} />
    ) : (
      <ul className="jobsList">
        {fetchedJobs.map(job => (
          <JobItem key={job.id} job={job} />
        ))}
      </ul>
    )

    const noJobsView = (
      <div className="nojobs">
        <img
          className="noJobsImg"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    )

    return noJobs ? noJobsView : jobItemsView
  }

  render() {
    const {
      profileDetails,
      isLoading,
      searchInput,
      profileFailure,
      isProfileLoading,
    } = this.state

    const {name, profileImageUrl, shortBio} = profileDetails

    const loader = (
      <div className="loader-container loaderDiv" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
    const jobs = this.jobsView()

    const displayProfile = profileFailure ? (
      <div className="retryDiv">
        <button type="button" className="retry" onClick={this.retryProfile}>
          Retry
        </button>
      </div>
    ) : (
      <div className="profile">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profileHead">{name}</h1>
        <p>{shortBio}</p>
      </div>
    )

    return (
      <>
        <Header />
        <div className="jobs">
          <div className="filters">
            {isProfileLoading ? loader : displayProfile}
            <hr />
            <div className="employmentFilters">
              <EmploymentFilters
                employmentFilterUpdate={this.employmentFilterUpdate}
              />
            </div>
            <hr />
            <div className="salaryFilters">
              <SalaryFilters salaryFilterUpdate={this.salaryFilterUpdate} />
            </div>
          </div>
          <div className="results">
            <div className="searchBarDiv">
              <input
                className="searchBar"
                type="search"
                placeholder="Search"
                value={searchInput}
              />
              <button
                className="searchIcon"
                type="button"
                data-testid="searchButton"
                onClick={this.search}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {isLoading ? loader : jobs}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
