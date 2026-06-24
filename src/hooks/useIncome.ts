import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Income, IncomeForm } from '@/types'
import toast from 'react-hot-toast'

export function useIncome(filters?: { source?: string; startDate?: string; endDate?: string }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: incomes = [], isLoading } = useQuery({
    queryKey: ['income', user?.id, filters],
    enabled: !!user,
    queryFn: async () => {
      let query = supabase
        .from('income')
        .select('*')
        .eq('user_id', user!.id)
        .order('date', { ascending: false })

      if (filters?.source && filters.source !== 'all') query = query.eq('source', filters.source)
      if (filters?.startDate) query = query.gte('date', filters.startDate)
      if (filters?.endDate) query = query.lte('date', filters.endDate)

      const { data, error } = await query
      if (error) throw error
      return data as Income[]
    }
  })

  const addIncome = useMutation({
    mutationFn: async (form: IncomeForm) => {
      const { error } = await supabase.from('income').insert({ ...form, user_id: user!.id })
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['income'] }); toast.success('Income added!') },
    onError: () => toast.error('Failed to add income')
  })

  const updateIncome = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<IncomeForm> }) => {
      const { error } = await supabase.from('income').update(data).eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['income'] }); toast.success('Income updated!') },
    onError: () => toast.error('Failed to update income')
  })

  const deleteIncome = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('income').delete().eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['income'] }); toast.success('Income deleted!') },
    onError: () => toast.error('Failed to delete income')
  })

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)

  return { incomes, isLoading, addIncome, updateIncome, deleteIncome, totalIncome }
}
