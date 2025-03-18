import LocationFilterItem from '../LocationFilterItem'

const LocationFilters = props => {
  const locationsList = [
    {
      location: 'Hyderabad',
    },
    {
      location: 'Mumbai',
    },
    {
      location: 'Chennai',
    },
    {
      location: 'Delhi',
    },
    {
      location: 'Bangalore',
    },
  ]

  const {locationFilterUpdate} = props

  const locationFilter = location => {
    locationFilterUpdate(location)
  }

  return (
    <div>
      <h1 className="filter-head">Location</h1>
      <ul>
        {locationsList.map(location => (
          <LocationFilterItem
            key={location.location}
            locationFilterItem={location}
            locationFilter={locationFilter}
          />
        ))}
      </ul>
    </div>
  )
}

export default LocationFilters
