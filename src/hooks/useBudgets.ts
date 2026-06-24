import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Budget, BudgetForm } from '@/types'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export function useBudgets(month?: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const currentMonth = month || format(new Date(), 'yyyy-MM')

  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ['budgets', user?.id, currentMonth],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user!.id)
        .eq('month', currentMonth)
        .order('category')
      if (error) throw error
      return data as Budget[]
    }
  })

  const addBudget = useMutation({
    mutationFn: async (form: BudgetForm) => {
      const { error } = await supabase.from('budgets').insert({ ...form, user_id: user!.id })
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['budgets'] }); toast.success('Budget created!') },
    onError: () => toast.error('Failed to create budget')
  })

  const updateBudget = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BudgetForm> }) => {
      const { error } = await supabase.from('budgets').update(data).eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['budgets'] }); toast.success('Budget updated!') },
    onError: () => toast.error('Failed to update budget')
  })

  const deleteBudget = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('budgets').delete().eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['budgets'] }); toast.success('Budget deleted!') },
    onError: () => toast.error('Failed to delete budget')
  })

  return { budgets, isLoading, addBudget, updateBudget, deleteBudget, currentMonth }
}
