import SalaryFilterItem from '../SalaryFilterItem'

const SalaryFilters = props => {
  const salaryRangesList = [
    {
      salaryRangeId: '1000000',
      label: '10 LPA and above',
    },
    {
      salaryRangeId: '2000000',
      label: '20 LPA and above',
    },
    {
      salaryRangeId: '3000000',
      label: '30 LPA and above',
    },
    {
      salaryRangeId: '4000000',
      label: '40 LPA and above',
    },
  ]

  const {salaryFilterUpdate} = props

  const salaryFilter = salary => {
    salaryFilterUpdate(salary)
  }

  return (
    <form>
      <h1>Salary Range</h1>
      <ul id="group">
        {salaryRangesList.map(salary => (
          <SalaryFilterItem
            key={salary.salaryRangeId}
            salary={salary}
            salaryFilter={salaryFilter}
          />
        ))}
      </ul>
    </form>
  )
}

export default SalaryFilters
