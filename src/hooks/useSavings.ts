import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { SavingsGoal, SavingsGoalForm } from '@/types'
import toast from 'react-hot-toast'

export function useSavings() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['savings', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as SavingsGoal[]
    }
  })

  const addGoal = useMutation({
    mutationFn: async (form: SavingsGoalForm) => {
      const { error } = await supabase.from('savings_goals').insert({ ...form, user_id: user!.id })
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['savings'] }); toast.success('Goal created!') },
    onError: () => toast.error('Failed to create goal')
  })

  const updateGoal = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SavingsGoalForm> }) => {
      const { error } = await supabase.from('savings_goals').update(data).eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['savings'] }); toast.success('Goal updated!') },
    onError: () => toast.error('Failed to update goal')
  })

  const deleteGoal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('savings_goals').delete().eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['savings'] }); toast.success('Goal deleted!') },
    onError: () => toast.error('Failed to delete goal')
  })

  return { goals, isLoading, addGoal, updateGoal, deleteGoal }
}
