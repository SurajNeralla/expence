import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Expense, ExpenseForm } from '@/types'
import toast from 'react-hot-toast'

export function useExpenses(filters?: { category?: string; startDate?: string; endDate?: string; search?: string }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses', user?.id, filters],
    enabled: !!user,
    queryFn: async () => {
      let query = supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user!.id)
        .order('date', { ascending: false })

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }
      if (filters?.startDate) query = query.gte('date', filters.startDate)
      if (filters?.endDate) query = query.lte('date', filters.endDate)
      if (filters?.search) query = query.ilike('description', `%${filters.search}%`)

      const { data, error } = await query
      if (error) throw error
      return data as Expense[]
    }
  })

  const addExpense = useMutation({
    mutationFn: async (form: ExpenseForm) => {
      const { error } = await supabase.from('expenses').insert({ ...form, user_id: user!.id })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast.success('Expense added!')
    },
    onError: () => toast.error('Failed to add expense')
  })

  const updateExpense = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ExpenseForm> }) => {
      const { error } = await supabase.from('expenses').update(data).eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast.success('Expense updated!')
    },
    onError: () => toast.error('Failed to update expense')
  })

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('expenses').delete().eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast.success('Expense deleted!')
    },
    onError: () => toast.error('Failed to delete expense')
  })

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  return { expenses, isLoading, addExpense, updateExpense, deleteExpense, totalExpenses }
}
