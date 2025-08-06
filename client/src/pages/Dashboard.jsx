import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useExpenses } from '../context/ExpenseContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    thisMonth: { total: 0, count: 0 },
    lastMonth: { total: 0, count: 0 },
    categoryBreakdown: [],
    recentExpenses: []
  })
  
  const { 
    expenses, 
    categories, 
    summary,
    pagination,
    loading, 
    fetchExpenses, 
    fetchCategories 
  } = useExpenses()

  useEffect(() => {
    fetchExpenses({ limit: 5 }) // Get recent expenses
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (expenses.length > 0) {
      calculateDashboardStats()
    }
  }, [expenses, categories])

  const calculateDashboardStats = () => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear

    // Calculate this month and last month totals
    const thisMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date)
      return expDate.getMonth() === thisMonth && expDate.getFullYear() === thisYear
    })

    const lastMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date)
      return expDate.getMonth() === lastMonth && expDate.getFullYear() === lastMonthYear
    })

    // Calculate category breakdown
    const categoryTotals = {}
    expenses.forEach(exp => {
      const categoryName = exp.category?.name || 'Uncategorized'
      const categoryIcon = exp.category?.icon || '📦'
      const categoryColor = exp.category?.color || '#BDC3C7'
      
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = { 
          total: 0, 
          count: 0, 
          icon: categoryIcon, 
          color: categoryColor 
        }
      }
      categoryTotals[categoryName].total += exp.amount
      categoryTotals[categoryName].count += 1
    })

    const categoryBreakdown = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }))

    setDashboardStats({
      thisMonth: {
        total: thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0),
        count: thisMonthExpenses.length
      },
      lastMonth: {
        total: lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0),
        count: lastMonthExpenses.length
      },
      categoryBreakdown,
      recentExpenses: expenses.slice(0, 5)
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getMonthName = (monthOffset = 0) => {
    const date = new Date()
    date.setMonth(date.getMonth() + monthOffset)
    return date.toLocaleDateString('en-US', { month: 'long' })
  }

  const getPercentageChange = () => {
    if (dashboardStats.lastMonth.total === 0) return null
    const change = ((dashboardStats.thisMonth.total - dashboardStats.lastMonth.total) / dashboardStats.lastMonth.total) * 100
    return change
  }

  if (loading && expenses.length === 0) {
    return <LoadingSpinner size="large" className="min-h-96" />
  }

  const percentageChange = getPercentageChange()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back! Here's your spending overview.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalAmount || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.totalCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🏷️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📈</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg per Expense</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.averageAmount || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">This Month</h2>
            <span className="text-2xl">📅</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="font-semibold">
                {formatCurrency(dashboardStats.thisMonth.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Expenses</span>
              <span className="font-semibold">{dashboardStats.thisMonth.count}</span>
            </div>
            {percentageChange !== null && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">vs Last Month</span>
                <span className={`font-semibold text-sm ${
                  percentageChange > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Last Month</h2>
            <span className="text-2xl">📊</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="font-semibold">
                {formatCurrency(dashboardStats.lastMonth.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Expenses</span>
              <span className="font-semibold">{dashboardStats.lastMonth.count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      {dashboardStats.categoryBreakdown.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Categories</h2>
            <Link to="/categories" className="text-blue-600 hover:text-blue-800 text-sm">
              Manage Categories
            </Link>
          </div>
          
          <div className="space-y-3">
            {dashboardStats.categoryBreakdown.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.count} expenses</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(category.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
          <Link to="/expenses" className="text-blue-600 hover:text-blue-800 text-sm">
            View All
          </Link>
        </div>
        
        {dashboardStats.recentExpenses.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 mb-2">No expenses recorded yet</p>
            <p className="text-sm text-gray-400 mb-4">
              Start tracking your spending by adding your first expense
            </p>
            <Link to="/expenses" className="btn btn-primary">
              Add Expense
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboardStats.recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  {expense.category && (
                    <span className="text-lg">{expense.category.icon}</span>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-500">
                      {expense.category?.name} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard