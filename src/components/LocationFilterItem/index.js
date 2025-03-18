import './index.css'

const LocationFilterItem = props => {
  const {locationFilterItem, locationFilter} = props
  const locationInput = () => {
    locationFilter(locationFilterItem.location)
  }
  const employmentLocation = locationFilterItem.location
  return (
    <li value={locationFilterItem.location} className="filter-item">
      <input
        type="checkbox"
        id={locationFilterItem.location}
        onClick={locationInput}
      />
      <label htmlFor={locationFilterItem.location}>{employmentLocation}</label>
    </li>
  )
}
export default LocationFilterItem
