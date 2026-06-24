import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { CATEGORY_COLORS } from '@/lib/utils'
import type { MonthlyData, CategoryData } from '@/types'

export function useDashboard() {
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const now = new Date()
      const monthStart = format(startOfMonth(now), 'yyyy-MM-dd')
      const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd')

      const [expensesRes, incomeRes, budgetsRes, billsRes, savingsRes] = await Promise.all([
        supabase.from('expenses').select('*').eq('user_id', user!.id).gte('date', monthStart).lte('date', monthEnd),
        supabase.from('income').select('*').eq('user_id', user!.id).gte('date', monthStart).lte('date', monthEnd),
        supabase.from('budgets').select('*').eq('user_id', user!.id).eq('month', format(now, 'yyyy-MM')),
        supabase.from('bills').select('*').eq('user_id', user!.id).eq('status', 'pending'),
        supabase.from('savings_goals').select('*').eq('user_id', user!.id)
      ])

      const expenses = expensesRes.data || []
      const income = incomeRes.data || []
      const totalExpenses = expenses.reduce((s: number, e: { amount: number }) => s + e.amount, 0)
      const totalIncome = income.reduce((s: number, i: { amount: number }) => s + i.amount, 0)
      const balance = totalIncome - totalExpenses
      const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0

      // Category breakdown
      const categoryMap: Record<string, number> = {}
      expenses.forEach((e: { category: string; amount: number }) => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount
      })
      const categoryData: CategoryData[] = Object.entries(categoryMap).map(([name, value]) => ({
        name, value, color: CATEGORY_COLORS[name] || '#6b7280'
      })).sort((a, b) => b.value - a.value)

      // Monthly trend (last 6 months)
      const monthlyData: MonthlyData[] = []
      for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i)
        const mStart = format(startOfMonth(d), 'yyyy-MM-dd')
        const mEnd = format(endOfMonth(d), 'yyyy-MM-dd')
        const [mExp, mInc] = await Promise.all([
          supabase.from('expenses').select('amount').eq('user_id', user!.id).gte('date', mStart).lte('date', mEnd),
          supabase.from('income').select('amount').eq('user_id', user!.id).gte('date', mStart).lte('date', mEnd)
        ])
        monthlyData.push({
          month: format(d, 'MMM'),
          expenses: (mExp.data || []).reduce((s: number, e: { amount: number }) => s + e.amount, 0),
          income: (mInc.data || []).reduce((s: number, i: { amount: number }) => s + i.amount, 0)
        })
      }

      // Recent transactions (merged and sorted)
      const [recentExp, recentInc] = await Promise.all([
        supabase.from('expenses').select('*').eq('user_id', user!.id).order('date', { ascending: false }).limit(5),
        supabase.from('income').select('*').eq('user_id', user!.id).order('date', { ascending: false }).limit(5)
      ])

      const recent = [
        ...(recentExp.data || []).map((e: { id: string; description: string; category: string; amount: number; date: string }) => ({
          ...e, type: 'expense' as const
        })),
        ...(recentInc.data || []).map((i: { id: string; source: string; amount: number; date: string }) => ({
          ...i, type: 'income' as const, description: i.source, category: 'Income'
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)

      return {
        totalExpenses, totalIncome, balance, savingsRate,
        activeBudgets: (budgetsRes.data || []).length,
        upcomingBills: (billsRes.data || []).length,
        categoryData, monthlyData, recent,
        bills: (billsRes.data || []).slice(0, 5),
        savings: savingsRes.data || []
      }
    },
    staleTime: 30000
  })

  return { data, isLoading }
}
