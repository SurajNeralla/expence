// Supabase client singleton
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Please check your .env.local file.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'id' | 'created_at'>; Update: Partial<Profile> }
      income: { Row: Income; Insert: Omit<Income, 'id' | 'created_at'>; Update: Partial<Income> }
      expenses: { Row: Expense; Insert: Omit<Expense, 'id' | 'created_at'>; Update: Partial<Expense> }
      budgets: { Row: Budget; Insert: Omit<Budget, 'id' | 'created_at'>; Update: Partial<Budget> }
      savings_goals: { Row: SavingsGoal; Insert: Omit<SavingsGoal, 'id' | 'created_at'>; Update: Partial<SavingsGoal> }
      subscriptions: { Row: Subscription; Insert: Omit<Subscription, 'id' | 'created_at'>; Update: Partial<Subscription> }
      bills: { Row: Bill; Insert: Omit<Bill, 'id' | 'created_at'>; Update: Partial<Bill> }
      notifications: { Row: Notification; Insert: Omit<Notification, 'id' | 'created_at'>; Update: Partial<Notification> }
    }
  }
}

// Re-export types used by supabase client
import type { Profile, Income, Expense, Budget, SavingsGoal, Subscription, Bill, Notification } from '@/types'
