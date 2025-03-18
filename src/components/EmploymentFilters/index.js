import EmploymentFilterItem from '../EmploymentFilterItem'

const EmploymentFilters = props => {
  const employmentTypesList = [
    {
      label: 'Full Time',
      employmentTypeId: 'FULLTIME',
    },
    {
      label: 'Part Time',
      employmentTypeId: 'PARTTIME',
    },
    {
      label: 'Freelance',
      employmentTypeId: 'FREELANCE',
    },
    {
      label: 'Internship',
      employmentTypeId: 'INTERNSHIP',
    },
  ]

  const {employmentFilterUpdate} = props

  const employmentFilter = employment => {
    employmentFilterUpdate(employment)
  }

  return (
    <div>
      <h1 className="filter-head">Type of Employment</h1>
      <ul>
        {employmentTypesList.map(employment => (
          <EmploymentFilterItem
            key={`EMP${employment.employmentTypeId}`}
            employmentFilterItem={employment}
            employmentFilter={employmentFilter}
          />
        ))}
      </ul>
    </div>
  )
}

export default EmploymentFilters
