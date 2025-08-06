import { useState, useEffect, useRef } from 'react'
import { useExpenses } from '../../context/ExpenseContext'

function ExpenseFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    startDate: '',
    endDate: ''
  })
  const isInitialMount = useRef(true)
  const onFilterChangeRef = useRef(onFilterChange)
  
  const { categories } = useExpenses()

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange
  })

  useEffect(() => {
    // Skip the initial mount to prevent unnecessary API call
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    
    // Debounce filter changes
    const timer = setTimeout(() => {
      onFilterChangeRef.current(filters)
    }, 300)

    return () => clearTimeout(timer)
  }, [filters])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleReset = () => {
    const resetFilters = {
      search: '',
      categoryId: '',
      startDate: '',
      endDate: ''
    }
    setFilters(resetFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search"
            name="search"
            type="text"
            className="input-field"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className="input-field"
            value={filters.categoryId}
            onChange={handleChange}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            className="input-field"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            className="input-field"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Search: "{filters.search}"
              <button
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.categoryId && (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Category: {categories.find(c => c.id.toString() === filters.categoryId)?.name}
              <button
                onClick={() => setFilters(prev => ({ ...prev, categoryId: '' }))}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.startDate && (
            <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              From: {filters.startDate}
              <button
                onClick={() => setFilters(prev => ({ ...prev, startDate: '' }))}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.endDate && (
            <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
              To: {filters.endDate}
              <button
                onClick={() => setFilters(prev => ({ ...prev, endDate: '' }))}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ExpenseFilters