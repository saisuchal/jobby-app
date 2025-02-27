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

class Jobs extends Component {
  state = {
    profileDetails: '',
    employmentFilter: [],
    locationFilter: [],
    salaryFilter: '1000000',
    searchInput: '',
    fetchedJobs: [],
    isLoading: true,
    isProfileLoading: true,
    noJobs: false,
    jobsFailure: false,
    profileFailure: false,
  }

  componentDidMount() {
    this.getProfile()
    this.fetchJobs()
  }

  getProfile = async () => {
    console.log('fetching profile')
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        const {profileDetails} = this.dataCamelCase(data)
        this.setState({
          isProfileLoading: false,
          profileFailure: false,
          profileDetails,
        })
      } else {
        this.setState({isProfileLoading: false, profileFailure: true})
      }
    } catch (e) {
      this.setState({isProfileLoading: false, profileFailure: true})
    }
  }

  fetchJobs = async () => {
    console.log('fetching jobs')
    const jwtToken = Cookies.get('jwt_token')
    const url = this.formatUrl()
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok) {
        const {jobs, total} = data
        const fetchedJobs = this.formatJobs(jobs)
        if (total === 0) {
          this.setState({isLoading: false, noJobs: true, jobsFailure: false})
        } else {
          this.setState(
            {
              isLoading: false,
              noJobs: false,
              jobsFailure: false,
              fetchedJobs,
            },
            this.filterByLocation,
          )
        }
      } else {
        this.setState({isLoading: false, jobsFailure: true})
      }
    } catch (e) {
      this.setState({isLoading: false, jobsFailure: true})
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
    name: data.name,
    profileImageUrl: data.profile_image_url,
    shortBio: data.short_bio,
  })

  dataCamelCase = data => ({
    profileDetails: this.profileCamelCase(data.profile_details),
  })

  searchFilter = event => {
    const {value} = event.target
    this.setState({searchInput: value})
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

  locationFilterUpdate = location => {
    const {locationFilter} = this.state
    if (locationFilter.includes(location)) {
      const index = locationFilter.indexOf(location)
      locationFilter.splice(index, 1)
    } else {
      locationFilter.push(location)
    }
    this.setState({locationFilter}, this.search)
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
      this.setState({fetchedJobs: filteredJobs, isLoading: false})
    } else {
      this.setState({isLoading: false})
    }
  }

  retryJobs = () => {
    console.log('retrying jobs')
    this.setState({isLoading: true, jobsFailure: false}, this.fetchJobs)
  }

  retryProfile = () => {
    console.log('retrying profile')
    this.setState(
      {isProfileLoading: true, profileFailure: false},
      this.getProfile,
    )
  }

  render() {
    const {
      isLoading,
      searchInput,
      noJobs,
      isProfileLoading,
      profileFailure,
      profileDetails,
      jobsFailure,
      fetchedJobs,
    } = this.state

    const {name, profileImageUrl, shortBio} = profileDetails

    const profileLoader = (
      <Loader
        data-testid="loader"
        color="white"
        type="ThreeDots"
        className="profile-loader-container"
      />
    )

    const loader = (
      <div data-testid="loader">
        <Loader color="white" type="ThreeDots" className="loader-container" />
      </div>
    )

    const jobsView = () => {
      const jobItemsView = jobsFailure ? (
        <FailureView retryJobs={this.retryJobs} />
      ) : (
        <ul className="jobs-list">
          {fetchedJobs.map(job => (
            <JobItem key={`JOB${job.id}`} job={job} />
          ))}
        </ul>
      )

      const noJobsView = (
        <div className="no-jobs-div">
          <img
            className="no-jobs-img"
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters</p>
        </div>
      )

      return noJobs ? noJobsView : jobItemsView
    }

    const profileSection = profileFailure ? (
      <div className="retry-div">
        <button
          type="button"
          className="retry-button"
          onClick={this.retryProfile}
        >
          Retry
        </button>
      </div>
    ) : (
      <div className="profile">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-head">{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
    const DisplayProfile = () =>
      isProfileLoading ? profileLoader : profileSection

    const DisplayJobs = () => (isLoading ? loader : jobsView())

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
                onClick={this.search}
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
