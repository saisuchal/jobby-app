import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FailureView from '../FailureView'
import SalaryFilters from '../SalaryFilters'
import EmploymentFilters from '../EmploymentFilters'
import LocationFilters from '../LocationFilters'
import JobItem from '../JobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: '',
    employmentFilter: [],
    locationFilter: [],
    salaryFilter: '1000000',
    searchInput: '',
    fetchedJobs: [],
    profileStatus: apiStatusConstants.initial,
    jobsStatus: apiStatusConstants.initial,
    total: '',
  }

  componentDidMount() {
    this.getProfile()
    this.fetchJobs()
  }

  getProfile = async () => {
    console.log('fetching profile')
    this.setState({profileStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const {profileDetails} = this.profileCamelCase(data.profile_details)
        this.setState({
          profileStatus: apiStatusConstants.success,
          profileDetails,
        })
      } else {
        this.setState({
          profileStatus: apiStatusConstants.failure,
        })
      }
    } catch (e) {
      this.setState({
        profileStatus: apiStatusConstants.failure,
      })
    }
  }

  fetchJobs = async () => {
    console.log('fetching jobs')
    this.setState({jobsStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = this.formatUrl()
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const {jobs, total} = data
        const fetchedJobs = this.formatJobs(jobs)
        this.setState(
          {
            total,
            fetchedJobs,
            jobsStatus: apiStatusConstants.success,
          },
          this.filterByLocation,
        )
      } else {
        this.setState({jobsStatus: apiStatusConstants.failure})
      }
    } catch (e) {
      this.setState({jobsStatus: apiStatusConstants.failure})
    }
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
    const empString =
      employmentFilter.length > 0 ? employmentFilter.join(',') : ''
    return `https://apis.ccbp.in/jobs?employment_type=${empString}&minimum_package=${salaryFilter}&search=${searchInput}`
  }

  profileCamelCase = data => ({
    profileDetails: {
      name: data.name,
      profileImageUrl: data.profile_image_url,
      shortBio: data.short_bio,
    },
  })

  searchFilter = event => {
    const {value} = event.target
    this.setState({searchInput: value})
  }

  salaryFilterUpdate = salary => {
    this.setState({salaryFilter: salary}, this.fetchJobs)
  }

  employmentFilterUpdate = employment => {
    const {employmentFilter} = this.state
    if (employmentFilter.includes(employment)) {
      const index = employmentFilter.indexOf(employment)
      employmentFilter.splice(index, 1)
    } else {
      employmentFilter.push(employment)
    }
    this.setState({employmentFilter}, this.fetchJobs)
  }

  locationFilterUpdate = location => {
    const {locationFilter} = this.state
    if (locationFilter.includes(location)) {
      const index = locationFilter.indexOf(location)
      locationFilter.splice(index, 1)
    } else {
      locationFilter.push(location)
    }
    this.setState({locationFilter}, this.fetchJobs)
  }

  filterByLocation = () => {
    const {locationFilter, fetchedJobs} = this.state
    const filteredJobs = []
    const filterByEachLocation = location => {
      const eachLocationJobs = fetchedJobs.filter(
        job => job.location === location,
      )
      filteredJobs.push(...eachLocationJobs)
    }
    if (locationFilter.length !== 0) {
      locationFilter.forEach(location => filterByEachLocation(location))
      this.setState({fetchedJobs: filteredJobs})
    }
  }

  jobsView = () => {
    const {total, jobsStatus, fetchedJobs} = this.state
    const loader = (
      <div data-testid="loader">
        <Loader color="white" type="ThreeDots" className="loader-container" />
      </div>
    )

    const jobs = (
      <div>
        {jobsStatus === apiStatusConstants.success && total > 0 ? (
          <ul className="jobs-list">
            {fetchedJobs.map(job => (
              <JobItem key={`JOB${job.id}`} job={job} />
            ))}
          </ul>
        ) : (
          <div className="no-jobs-div">
            <img
              className="no-jobs-img"
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        )}
        {jobsStatus === apiStatusConstants.failure && (
          <FailureView retry={this.fetchJobs} />
        )}
      </div>
    )

    const jobsFailureView = <FailureView retry={this.fetchJobs} />

    switch (true) {
      case jobsStatus === apiStatusConstants.success:
        return jobs
      case jobsStatus === apiStatusConstants.failure:
        return jobsFailureView
      case jobsStatus === apiStatusConstants.inProgress:
        return loader
      default:
        return null
    }
  }

  profileView = () => {
    const {profileStatus, jobsStatus, profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    const profileLoader = (
      <div data-testid="loader">
        <Loader
          color="white"
          type="ThreeDots"
          className="profile-loader-container"
        />
      </div>
    )

    const profile =
      profileStatus === apiStatusConstants.failure ? (
        <div className="profile-div">
          <button
            type="button"
            className="retry-button"
            onClick={this.getProfile}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="profile-div">
          <div className="profile-success-div">
            <img src={profileImageUrl} alt="profile" />
            <h1 className="profile-head">{name}</h1>
            <p>{shortBio}</p>
          </div>
        </div>
      )

    switch (true) {
      case (profileStatus === apiStatusConstants.success &&
        jobsStatus === apiStatusConstants.success) ||
        profileStatus === apiStatusConstants.failure:
        return profile
      case profileStatus === apiStatusConstants.inProgress:
        return profileLoader
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    console.log(this.state)
    const DisplayJobs = () => this.jobsView()
    const DisplayProfile = () => this.profileView()
    return (
      <div>
        <Header />
        <div className="jobs-and-filters-div">
          <div className="filters-div">
            <DisplayProfile />
            <hr />
            <div className="employment-filters-div">
              <EmploymentFilters
                employmentFilterUpdate={this.employmentFilterUpdate}
              />
            </div>
            <hr />
            <div className="salary-filters-div">
              <SalaryFilters salaryFilterUpdate={this.salaryFilterUpdate} />
            </div>
            <hr />
            <div className="location-filters-div">
              <LocationFilters
                locationFilterUpdate={this.locationFilterUpdate}
              />
            </div>
          </div>
          <div className="results-div">
            <div className="search-bar-div">
              <input
                className="searchbar"
                type="search"
                placeholder="Search"
                value={searchInput}
                onChange={this.searchFilter}
              />
              <button
                className="search-icon"
                type="button"
                data-testid="searchButton"
                onClick={this.fetchJobs}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <DisplayJobs className="results-div" />
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
