const SalaryFilterItem = props => {
  const {salary, salaryFilter} = props
  const salaryFilterInput = () => {
    salaryFilter(salary.salaryRangeId)
  }
  return (
    <li>
      <input
        className="inputLabel form-control"
        type="radio"
        name="group"
        onClick={salaryFilterInput}
        defaultValue={salary.salaryRangeId}
      />
      <label htmlFor={salary.salaryRangeId}>{salary.label}</label>
    </li>
  )
}

export default SalaryFilterItem
