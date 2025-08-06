import { useState, useEffect } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import CategoryForm from '../components/forms/CategoryForm'
import CategoryList from '../components/categories/CategoryList'

function Categories() {
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const { categories, loading, error, fetchCategories, clearError } = useExpenses()

  useEffect(() => {
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const handleAddCategory = () => {
    setEditingCategory(null)
    setShowForm(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCategory(null)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCategory(null)
    fetchCategories() // Refresh the list
  }

  if (loading && categories.length === 0) {
    return <LoadingSpinner size="large" className="min-h-96" />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button 
          className="btn btn-primary"
          onClick={handleAddCategory}
        >
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

      <CategoryList
        categories={categories}
        onEdit={handleEditCategory}
        loading={loading}
      />
    </div>
  )
}

export default Categories