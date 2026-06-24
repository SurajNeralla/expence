import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO, isAfter, isBefore, addDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number, currency = '₹'): string {
  if (amount >= 100000) {
    return `${currency}${(amount / 100000).toFixed(2)}L`
  }
  if (amount >= 1000) {
    return `${currency}${(amount / 1000).toFixed(1)}K`
  }
  return `${currency}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Full currency (no abbreviation)
export function formatCurrencyFull(amount: number, currency = '₹'): string {
  return `${currency}${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Format date
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd MMM yyyy')
}

// Format date relative
export function formatDateRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

// Format date for input
export function formatDateInput(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'yyyy-MM-dd')
}

// Get percentage
export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.min(Math.round((value / total) * 100), 100)
}

// Get days remaining
export function getDaysRemaining(targetDate: string): number {
  const target = parseISO(targetDate)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Is overdue
export function isOverdue(dueDate: string): boolean {
  return isBefore(parseISO(dueDate), new Date())
}

// Is due soon (within 3 days)
export function isDueSoon(dueDate: string): boolean {
  const d = parseISO(dueDate)
  const now = new Date()
  return isAfter(d, now) && isBefore(d, addDays(now, 3))
}

// Category color class
export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Shopping: '#ec4899',
  Rent: '#8b5cf6',
  Utilities: '#06b6d4',
  Education: '#6366f1',
  Entertainment: '#f43f5e',
  Health: '#10b981',
  Travel: '#14b8a6',
  Other: '#6b7280',
}

export const CATEGORY_BG: Record<string, string> = {
  Food: 'cat-food',
  Transport: 'cat-transport',
  Shopping: 'cat-shopping',
  Rent: 'cat-rent',
  Utilities: 'cat-utilities',
  Education: 'cat-education',
  Entertainment: 'cat-entertainment',
  Health: 'cat-health',
  Travel: 'cat-travel',
  Other: 'cat-other',
}

export const EXPENSE_CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Rent', 'Utilities',
  'Education', 'Entertainment', 'Health', 'Travel', 'Other'
]

export const INCOME_SOURCES = [
  'Salary', 'Freelancing', 'Business', 'Investment', 'Scholarship', 'Other'
]

export const PAYMENT_METHODS = [
  'Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Other'
]

// Generate CSV from data
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h]
        const escaped = String(val ?? '').replace(/"/g, '""')
        return `"${escaped}"`
      }).join(',')
    )
  ]
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// Get current month range
export function getCurrentMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { start: formatDateInput(start), end: formatDateInput(end) }
}

// Get last N months labels
export function getLastNMonths(n: number): string[] {
  const months = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    months.push(format(d, 'MMM yyyy'))
  }
  return months
}
