import { useState } from 'react'
import { useExpenses } from '../../context/ExpenseContext'
import LoadingSpinner from '../common/LoadingSpinner'

function CategoryList({ categories, onEdit, loading }) {
  const [deletingId, setDeletingId] = useState(null)
  const { deleteCategory } = useExpenses()

  const handleDelete = async (category) => {
    if (category.isDefault) {
      alert('Cannot delete default categories')
      return
    }

    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      setDeletingId(category.id)
      try {
        const result = await deleteCategory(category.id)
        if (!result.success) {
          alert(result.error)
        }
      } catch (error) {
        console.error('Delete error:', error)
        alert('Failed to delete category')
      } finally {
        setDeletingId(null)
      }
    }
  }

  const userCategories = categories.filter(cat => !cat.isDefault)
  const defaultCategories = categories.filter(cat => cat.isDefault)

  return (
    <div className="space-y-6">
      {/* User Categories */}
      {userCategories.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Categories</h2>
            <span className="text-sm text-gray-500">{userCategories.length} categories</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userCategories.map((category) => (
              <div
                key={category.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEdit(category)}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                      title="Edit category"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      disabled={deletingId === category.id}
                      className="p-1 text-gray-400 hover:text-red-600 rounded disabled:opacity-50"
                      title="Delete category"
                    >
                      {deletingId === category.id ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        '🗑️'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Default Categories */}
      {defaultCategories.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Default Categories</h2>
            <span className="text-sm text-gray-500">{defaultCategories.length} categories</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultCategories.map((category) => (
              <div
                key={category.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    )}
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full mt-1 inline-block">
                      System Default
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.length === 0 && !loading && (
        <div className="card">
          <div className="text-center py-8">
            <p className="text-gray-500">No categories found.</p>
            <p className="text-sm text-gray-400 mt-1">
              Create your first category to start organizing your expenses.
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center">
          <LoadingSpinner size="medium" />
        </div>
      )}
    </div>
  )
}

export default CategoryList