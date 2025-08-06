import { useState, useEffect } from 'react'
import { useExpenses } from '../../context/ExpenseContext'
import LoadingSpinner from '../common/LoadingSpinner'

function ExpenseForm({ expense, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    notes: '',
    tags: []
  })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')
  
  const { addExpense, updateExpense, categories, fetchCategories } = useExpenses()
  const isEditing = !!expense

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories()
    }
  }, [categories.length, fetchCategories])

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount?.toString() || '',
        description: expense.description || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        categoryId: expense.categoryId?.toString() || '',
        notes: expense.notes || '',
        tags: expense.tags || []
      })
    }
  }, [expense])

  const validateForm = () => {
    const errors = {}
    
    if (!formData.amount.trim()) {
      errors.amount = 'Amount is required'
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Amount must be a positive number'
    } else if (parseFloat(formData.amount) > 999999.99) {
      errors.amount = 'Amount cannot exceed $999,999.99'
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required'
    } else if (formData.description.trim().length > 255) {
      errors.description = 'Description must be less than 255 characters'
    }
    
    if (!formData.date) {
      errors.date = 'Date is required'
    }
    
    if (!formData.categoryId) {
      errors.categoryId = 'Please select a category'
    }
    
    if (formData.notes && formData.notes.length > 1000) {
      errors.notes = 'Notes must be less than 1000 characters'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const expenseData = {
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        date: formData.date,
        categoryId: parseInt(formData.categoryId),
        notes: formData.notes.trim(),
        tags: formData.tags
      }
      
      let result
      if (isEditing) {
        result = await updateExpense(expense.id, expenseData)
      } else {
        result = await addExpense(expenseData)
      }
      
      if (result.success) {
        onSuccess()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const availableCategories = categories.filter(cat => cat.userId === null || !cat.isDefault || true)

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[32rem] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="form-label">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    max="999999.99"
                    required
                    className={`input-field pl-8 ${formErrors.amount ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>
                {formErrors.amount && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>
                )}
              </div>

              <div>
                <label htmlFor="date" className="form-label">
                  Date *
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  className={`input-field ${formErrors.date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                />
                {formErrors.date && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <input
                id="description"
                name="description"
                type="text"
                required
                className={`input-field ${formErrors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter expense description"
                value={formData.description}
                onChange={handleChange}
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="categoryId" className="form-label">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                className={`input-field ${formErrors.categoryId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {formErrors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{formErrors.categoryId}</p>
              )}
            </div>

            <div>
              <label htmlFor="notes" className="form-label">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className={`input-field ${formErrors.notes ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Additional notes (optional)"
                value={formData.notes}
                onChange={handleChange}
              />
              {formErrors.notes && (
                <p className="mt-1 text-sm text-red-600">{formErrors.notes}</p>
              )}
            </div>

            <div>
              <label className="form-label">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="input-field rounded-r-none"
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  maxLength={50}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || formData.tags.length >= 10}
                  className="px-4 py-2 bg-gray-100 text-gray-700 border border-l-0 rounded-r-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Press Enter or click Add to add tags. Maximum 10 tags.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center"
                disabled={loading}
              >
                {loading && <LoadingSpinner size="small" className="mr-2" />}
                {isEditing ? 'Update Expense' : 'Create Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ExpenseForm