import { useState, useEffect } from 'react'
import { useExpenses } from '../../context/ExpenseContext'
import LoadingSpinner from '../common/LoadingSpinner'

const defaultColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BDC3C7', '#FF8A80',
  '#81C784', '#64B5F6', '#FFB74D', '#A1887F', '#90A4AE'
]

const defaultIcons = [
  '🍽️', '🚗', '🛍️', '🎬', '💡', '🏥', '📚', '✈️', '📦', '💰',
  '🏠', '🎵', '💼', '🏃', '🎨', '🔧', '☕', '🎯', '📱', '🌟'
]

function CategoryForm({ category, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: defaultColors[0],
    icon: defaultIcons[0]
  })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { addCategory, updateCategory } = useExpenses()
  const isEditing = !!category

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        color: category.color || defaultColors[0],
        icon: category.icon || defaultIcons[0]
      })
    }
  }, [category])

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Category name is required'
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Category name must be less than 100 characters'
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters'
    }
    
    if (!formData.color.match(/^#[0-9A-Fa-f]{6}$/)) {
      errors.color = 'Please select a valid color'
    }
    
    if (!formData.icon.trim()) {
      errors.icon = 'Please select an icon'
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

  const handleColorSelect = (color) => {
    setFormData({ ...formData, color })
    if (formErrors.color) {
      setFormErrors({ ...formErrors, color: '' })
    }
  }

  const handleIconSelect = (icon) => {
    setFormData({ ...formData, icon })
    if (formErrors.icon) {
      setFormErrors({ ...formErrors, icon: '' })
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
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
        icon: formData.icon
      }
      
      let result
      if (isEditing) {
        result = await updateCategory(category.id, categoryData)
      } else {
        result = await addCategory(categoryData)
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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit Category' : 'Add New Category'}
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
            <div>
              <label htmlFor="name" className="form-label">
                Category Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={`input-field ${formErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter category name"
                value={formData.name}
                onChange={handleChange}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className={`input-field ${formErrors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter category description (optional)"
                value={formData.description}
                onChange={handleChange}
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
              )}
            </div>

            <div>
              <label className="form-label">Color *</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {defaultColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {formErrors.color && (
                <p className="mt-1 text-sm text-red-600">{formErrors.color}</p>
              )}
            </div>

            <div>
              <label className="form-label">Icon *</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {defaultIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleIconSelect(icon)}
                    className={`w-8 h-8 text-lg flex items-center justify-center rounded border ${
                      formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              {formErrors.icon && (
                <p className="mt-1 text-sm text-red-600">{formErrors.icon}</p>
              )}
            </div>

            <div>
              <label className="form-label">Preview</label>
              <div className="flex items-center space-x-2 p-3 border rounded-md bg-gray-50">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: formData.color }}
                >
                  {formData.icon}
                </div>
                <span className="font-medium">
                  {formData.name || 'Category Name'}
                </span>
              </div>
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
                {isEditing ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CategoryForm