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
      <h2>Location</h2>
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
