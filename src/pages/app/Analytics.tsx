import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { CATEGORY_COLORS, formatCurrency } from '@/lib/utils'

const TOOLTIP_STYLE = {
  background: 'rgba(15,15,30,0.95)',
  border: '1px solid rgba(99,102,241,0.2)',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '13px',
}

function useAnalyticsData() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['analytics', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const now = new Date()

      // Last 12 months data
      const monthly = []
      for (let i = 11; i >= 0; i--) {
        const d = subMonths(now, i)
        const mStart = format(startOfMonth(d), 'yyyy-MM-dd')
        const mEnd = format(endOfMonth(d), 'yyyy-MM-dd')
        const [e, inc] = await Promise.all([
          supabase.from('expenses').select('amount').eq('user_id', user!.id).gte('date', mStart).lte('date', mEnd),
          supabase.from('income').select('amount').eq('user_id', user!.id).gte('date', mStart).lte('date', mEnd),
        ])
        const totalExp = (e.data || []).reduce((s: number, x: { amount: number }) => s + x.amount, 0)
        const totalInc = (inc.data || []).reduce((s: number, x: { amount: number }) => s + x.amount, 0)
        monthly.push({ month: format(d, 'MMM yy'), expenses: totalExp, income: totalInc, savings: totalInc - totalExp })
      }

      // Category breakdown (all time)
      const { data: allExp } = await supabase.from('expenses').select('category,amount').eq('user_id', user!.id)
      const catMap: Record<string, number> = {}
      ;(allExp || []).forEach((e: { category: string; amount: number }) => {
        catMap[e.category] = (catMap[e.category] || 0) + e.amount
      })
      const categoryData = Object.entries(catMap)
        .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || '#6b7280' }))
        .sort((a, b) => b.value - a.value)

      // Savings goals progress
      const { data: goals } = await supabase.from('savings_goals').select('*').eq('user_id', user!.id)

      return { monthly, categoryData, goals: goals || [] }
    },
    staleTime: 60000
  })
}

export default function Analytics() {
  const { data, isLoading } = useAnalyticsData()

  if (isLoading) return (
    <div className="flex items-center justify-center h-64"><Loader2 size={32} className="animate-spin text-primary" /></div>
  )

  const d = data || { monthly: [], categoryData: [], goals: [] }

  const totalIncome = d.monthly.reduce((s, m) => s + m.income, 0)
  const totalExpenses = d.monthly.reduce((s, m) => s + m.expenses, 0)
  const totalSavings = d.monthly.reduce((s, m) => s + Math.max(m.savings, 0), 0)
  const avgMonthly = d.monthly.length > 0 ? totalExpenses / d.monthly.length : 0

  return (
    <div className="space-y-6 animate-in">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Deep dive into your financial trends</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '12-Month Income', value: formatCurrency(totalIncome), color: 'text-emerald-400' },
          { label: '12-Month Expenses', value: formatCurrency(totalExpenses), color: 'text-red-400' },
          { label: 'Total Saved', value: formatCurrency(totalSavings), color: 'text-indigo-400' },
          { label: 'Avg Monthly Spend', value: formatCurrency(avgMonthly), color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="stat-card text-center">
            <div className={`text-xl font-display font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 12-Month Trend */}
      <div className="chart-container">
        <div className="mb-5">
          <h2 className="font-display font-semibold">12-Month Income vs Expenses</h2>
          <p className="text-xs text-muted-foreground">Full year financial overview</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={d.monthly} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="incA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="savA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
            <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#incA)" />
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expA)" />
            <Area type="monotone" dataKey="savings" name="Net Savings" stroke="#6366f1" strokeWidth={2} fill="url(#savA)" />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Bar + Category */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Bar */}
        <div className="chart-container">
          <div className="mb-5">
            <h2 className="font-display font-semibold">Monthly Spending</h2>
            <p className="text-xs text-muted-foreground">Expenses per month</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.monthly.slice(-6)} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
              <Bar dataKey="expenses" name="Expenses" fill="url(#barGrad)" radius={[4, 4, 0, 0]}>
                {d.monthly.slice(-6).map((_, i) => (
                  <Cell key={i} fill={`rgba(99,102,241,${0.4 + (i / 6) * 0.6})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="chart-container">
          <div className="mb-5">
            <h2 className="font-display font-semibold">Expense Categories</h2>
            <p className="text-xs text-muted-foreground">All-time breakdown</p>
          </div>
          {d.categoryData.length > 0 ? (
            <div className="space-y-3">
              {d.categoryData.map(cat => {
                const total = d.categoryData.reduce((s, c) => s + c.value, 0)
                const pct = total > 0 ? Math.round((cat.value / total) * 100) : 0
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span>{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{pct}%</span>
                        <span className="font-medium">{formatCurrency(cat.value)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">No expense data yet</div>
          )}
        </div>
      </div>

      {/* Savings Goals Progress */}
      {d.goals.length > 0 && (
        <div className="chart-container">
          <div className="mb-5">
            <h2 className="font-display font-semibold">Savings Goals Progress</h2>
            <p className="text-xs text-muted-foreground">How close you are to each goal</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.goals.map((g: { goal_name: string; current_amount: number; target_amount: number }) => ({
              name: g.goal_name.length > 12 ? g.goal_name.slice(0, 12) + '…' : g.goal_name,
              saved: g.current_amount,
              target: g.target_amount - g.current_amount
            }))} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
              <Bar dataKey="saved" name="Saved" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="target" name="Remaining" stackId="a" fill="rgba(99,102,241,0.2)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
