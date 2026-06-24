import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Subscription, SubscriptionForm } from '@/types'
import toast from 'react-hot-toast'

export function useSubscriptions() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['subscriptions', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user!.id)
        .order('renewal_date', { ascending: true })
      if (error) throw error
      return data as Subscription[]
    }
  })

  const addSubscription = useMutation({
    mutationFn: async (form: SubscriptionForm) => {
      const { error } = await supabase.from('subscriptions').insert({ ...form, user_id: user!.id })
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subscriptions'] }); toast.success('Subscription added!') },
    onError: () => toast.error('Failed to add subscription')
  })

  const updateSubscription = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SubscriptionForm> }) => {
      const { error } = await supabase.from('subscriptions').update(data).eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subscriptions'] }); toast.success('Subscription updated!') },
    onError: () => toast.error('Failed to update subscription')
  })

  const deleteSubscription = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subscriptions').delete().eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subscriptions'] }); toast.success('Subscription deleted!') },
    onError: () => toast.error('Failed to delete subscription')
  })

  const monthlyTotal = subscriptions.filter(s => s.is_active).reduce((sum, s) => sum + s.cost, 0)

  return { subscriptions, isLoading, addSubscription, updateSubscription, deleteSubscription, monthlyTotal }
}
