import React, { createContext, useContext, useReducer } from 'react'
import apiService from '../services/api'

const ExpenseContext = createContext(null)

const initialState = {
  expenses: [],
  categories: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  },
  summary: {
    totalAmount: 0,
    averageAmount: 0
  },
  filters: {
    categoryId: null,
    startDate: null,
    endDate: null,
    search: ''
  }
}

function expenseReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'SET_EXPENSES':
      return { 
        ...state, 
        expenses: action.payload.expenses || [], 
        pagination: {
          ...state.pagination,
          ...action.payload.pagination
        },
        summary: {
          ...state.summary,
          ...action.payload.summary
        },
        loading: false, 
        error: null 
      }
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload, loading: false, error: null }
    case 'ADD_EXPENSE':
      return { 
        ...state, 
        expenses: [action.payload, ...state.expenses],
        pagination: {
          ...state.pagination,
          totalCount: state.pagination.totalCount + 1
        }
      }
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        )
      }
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
        pagination: {
          ...state.pagination,
          totalCount: Math.max(0, state.pagination.totalCount - 1)
        }
      }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] }
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        )
      }
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      }
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'SET_PAGINATION':
      return { ...state, pagination: { ...state.pagination, ...action.payload } }
    default:
      return state
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState)

  // Expense operations
  const fetchExpenses = async (options = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const params = {
        page: options.page || 1,
        limit: options.limit || 20,
        ...options.filters
      }
      
      // Clean up null/undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === undefined || params[key] === '') {
          delete params[key]
        }
      })

      const response = await apiService.get('/expenses', { params })
      dispatch({ type: 'SET_EXPENSES', payload: response.data })
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch expenses'
      dispatch({ type: 'SET_ERROR', payload: message })
    }
  }

  const addExpense = async (expenseData) => {
    try {
      const response = await apiService.post('/expenses', expenseData)
      dispatch({ type: 'ADD_EXPENSE', payload: response.data.expense })
      return { success: true, expense: response.data.expense }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create expense'
      dispatch({ type: 'SET_ERROR', payload: message })
      return { success: false, error: message }
    }
  }

  const updateExpense = async (id, expenseData) => {
    try {
      const response = await apiService.put(`/expenses/${id}`, expenseData)
      dispatch({ type: 'UPDATE_EXPENSE', payload: response.data.expense })
      return { success: true, expense: response.data.expense }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update expense'
      dispatch({ type: 'SET_ERROR', payload: message })
      return { success: false, error: message }
    }
  }

  const deleteExpense = async (id) => {
    try {
      await apiService.delete(`/expenses/${id}`)
      dispatch({ type: 'DELETE_EXPENSE', payload: id })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete expense'
      dispatch({ type: 'SET_ERROR', payload: message })
      return { success: false, error: message }
    }
  }

  // Category operations
  const fetchCategories = async () => {
    try {
      const response = await apiService.get('/categories')
      dispatch({ type: 'SET_CATEGORIES', payload: response.data.categories })
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch categories'
      dispatch({ type: 'SET_ERROR', payload: message })
    }
  }

  const addCategory = async (categoryData) => {
    try {
      const response = await apiService.post('/categories', categoryData)
      dispatch({ type: 'ADD_CATEGORY', payload: response.data.category })
      return { success: true, category: response.data.category }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create category'
      dispatch({ type: 'SET_ERROR', payload: message })
      return { success: false, error: message }
    }
  }

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await apiService.put(`/categories/${id}`, categoryData)
      dispatch({ type: 'UPDATE_CATEGORY', payload: response.data.category })
      return { success: true, category: response.data.category }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update category'
      dispatch({ type: 'SET_ERROR', payload: message })
      return { success: false, error: message }
    }
  }

  const deleteCategory = async (id) => {
    try {
      await apiService.delete(`/categories/${id}`)
      dispatch({ type: 'DELETE_CATEGORY', payload: id })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete category'
      dispatch({ type: 'SET_ERROR', payload: message })
      return { success: false, error: message }
    }
  }

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    setFilters,
    clearError
  }

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider')
  }
  return context
}