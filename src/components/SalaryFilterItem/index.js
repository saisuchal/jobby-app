import './index.css'

const SalaryFilterItem = props => {
  const {salary, salaryFilter} = props
  const salaryFilterInput = () => {
    salaryFilter(salary.salaryRangeId)
  }
  return (
    <li className="filter-item">
      <input
        type="radio"
        name="group"
        onClick={salaryFilterInput}
        id={salary.salaryRangeId}
      />
      <label htmlFor={salary.salaryRangeId}>{salary.label}</label>
    </li>
  )
}

export default SalaryFilterItem
