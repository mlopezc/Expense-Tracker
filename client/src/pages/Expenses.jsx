import { useState, useEffect } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ExpenseForm from '../components/forms/ExpenseForm'
import ExpenseList from '../components/expenses/ExpenseList'
import ExpenseFilters from '../components/expenses/ExpenseFilters'

function Expenses() {
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const { 
    expenses, 
    pagination, 
    summary, 
    loading, 
    error, 
    fetchExpenses, 
    fetchCategories,
    clearError 
  } = useExpenses()

  useEffect(() => {
    fetchExpenses()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const handleAddExpense = () => {
    setEditingExpense(null)
    setShowForm(true)
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingExpense(null)
    fetchExpenses() // Refresh the list
  }

  const handleFilterChange = (filters) => {
    fetchExpenses({ filters, page: 1 })
  }

  const handlePageChange = (page) => {
    fetchExpenses({ page })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-600 mt-1">
            {pagination.totalCount > 0 && (
              <>Total: ${summary.totalAmount.toFixed(2)} • {pagination.totalCount} expenses</>
            )}
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleAddExpense}
        >
          Add Expense
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

      <ExpenseFilters onFilterChange={handleFilterChange} />

      <ExpenseList
        expenses={expenses}
        pagination={pagination}
        onEdit={handleEditExpense}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  )
}

export default Expenses