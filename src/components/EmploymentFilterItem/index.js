import './index.css'

const EmploymentFilterItem = props => {
  const {employmentFilterItem, employmentFilter} = props

  const employmentInput = () => {
    employmentFilter(employmentFilterItem.employmentTypeId)
  }
  return (
    <li value={employmentFilterItem.employmentTypeId}>
      <input
        className="inputLabel"
        type="checkbox"
        id={employmentFilterItem.employmentTypeId}
        onClick={employmentInput}
      />
      <label htmlFor={employmentFilterItem.employmentTypeId}>
        {employmentFilterItem.label}
      </label>
    </li>
  )
}
export default EmploymentFilterItem
