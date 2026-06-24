import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Bill, BillForm } from '@/types'
import toast from 'react-hot-toast'

export function useBills() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: bills = [], isLoading } = useQuery({
    queryKey: ['bills', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('user_id', user!.id)
        .order('due_date', { ascending: true })
      if (error) throw error
      return data as Bill[]
    }
  })

  const addBill = useMutation({
    mutationFn: async (form: BillForm) => {
      const { error } = await supabase.from('bills').insert({ ...form, user_id: user!.id })
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['bills'] }); toast.success('Bill added!') },
    onError: () => toast.error('Failed to add bill')
  })

  const updateBill = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BillForm> }) => {
      const { error } = await supabase.from('bills').update(data).eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['bills'] }); toast.success('Bill updated!') },
    onError: () => toast.error('Failed to update bill')
  })

  const deleteBill = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bills').delete().eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['bills'] }); toast.success('Bill deleted!') },
    onError: () => toast.error('Failed to delete bill')
  })

  const markAsPaid = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bills').update({ status: 'paid' }).eq('id', id).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['bills'] }); toast.success('Bill marked as paid!') },
    onError: () => toast.error('Failed to update bill')
  })

  const pendingBills = bills.filter(b => b.status === 'pending')
  const overdueBills = bills.filter(b => b.status === 'overdue')

  return { bills, isLoading, addBill, updateBill, deleteBill, markAsPaid, pendingBills, overdueBills }
}
