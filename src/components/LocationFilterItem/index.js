import './index.css'

const LocationFilterItem = props => {
  const {locationFilterItem, locationFilter} = props
  const locationInput = () => {
    locationFilter(locationFilterItem.location)
  }
  return (
    <li value={locationFilterItem.location} className="filter-item">
      <input
        type="checkbox"
        id={locationFilterItem.location}
        onClick={locationInput}
      />
      <label htmlFor={locationFilterItem.location}>
        {locationFilterItem.location}
      </label>
    </li>
  )
}
export default LocationFilterItem
