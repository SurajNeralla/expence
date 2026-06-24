// Core TypeScript types for Expense Tracker

export interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  currency?: string
  created_at: string
}

export interface Income {
  id: string
  user_id: string
  amount: number
  source: string
  notes?: string
  date: string
  created_at: string
}

export interface Expense {
  id: string
  user_id: string
  amount: number
  category: string
  description: string
  payment_method: string
  date: string
  tags?: string[]
  created_at: string
}

export interface Budget {
  id: string
  user_id: string
  category: string
  budget_amount: number
  month: string // 'YYYY-MM'
  created_at: string
}

export interface SavingsGoal {
  id: string
  user_id: string
  goal_name: string
  target_amount: number
  current_amount: number
  target_date: string
  icon?: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  name: string
  cost: number
  renewal_date: string
  category?: string
  is_active: boolean
  created_at: string
}

export interface Bill {
  id: string
  user_id: string
  bill_name: string
  amount: number
  due_date: string
  status: 'pending' | 'paid' | 'overdue'
  category?: string
  notes?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'danger'
  read: boolean
  created_at: string
}

// Dashboard summary types
export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  savingsRate: number
  activeBudgets: number
  upcomingBills: number
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
}

export interface CategoryData {
  name: string
  value: number
  color: string
}

// Form types
export type IncomeForm = Omit<Income, 'id' | 'user_id' | 'created_at'>
export type ExpenseForm = Omit<Expense, 'id' | 'user_id' | 'created_at'>
export type BudgetForm = Omit<Budget, 'id' | 'user_id' | 'created_at'>
export type SavingsGoalForm = Omit<SavingsGoal, 'id' | 'user_id' | 'created_at'>
export type SubscriptionForm = Omit<Subscription, 'id' | 'user_id' | 'created_at'>
export type BillForm = Omit<Bill, 'id' | 'user_id' | 'created_at'>

// AI Insight type
export interface AIInsight {
  id: string
  title: string
  description: string
  type: 'success' | 'warning' | 'danger' | 'info'
  icon: string
  value?: string
  change?: number
}
