import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

function StatCard({
  title, value, icon, color, sub, delay
}: {
  title: string; value: string; icon: string;
  color: string; sub?: string; delay?: string
}) {
  return (
    <div className={`glass-card p-5 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 flex flex-col justify-between animate-in ${delay || ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-on-surface-variant font-medium">{title}</div>
        {sub && <div className="text-[10px] text-on-surface-variant/70 mt-1">{sub}</div>}
      </div>
    </div>
  )
}

const CUSTOM_TOOLTIP_STYLE = {
  background: 'rgba(30, 41, 59, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  padding: '10px 14px',
  fontSize: '13px',
  color: '#e0e3e5'
}

export default function Dashboard() {
  const { data, isLoading } = useDashboard()
  const { profile } = useAuth()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll('.glass-card')
      cards.forEach(card => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        ;(card as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
        ;(card as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isLoading])

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  )

  const d = data || {
    totalIncome: 0, totalExpenses: 0, balance: 0, savingsRate: 0,
    activeBudgets: 0, upcomingBills: 0, categoryData: [], monthlyData: [],
    recent: [], bills: [], savings: []
  }

  return (
    <div className="space-y-6 animate-in text-on-surface">
      {/* Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {profile?.full_name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">Here's your financial overview for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/expenses" className="bg-gradient-to-r from-primary to-secondary text-on-primary-container font-bold px-4 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(173,198,255,0.4)] transition-all text-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm font-bold">add_circle</span> Add Expense
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Income" value={formatCurrency(d.totalIncome)} icon="trending_up"
          color="bg-emerald-500/15 text-emerald-400" delay="stagger-1" />
        <StatCard title="Total Expenses" value={formatCurrency(d.totalExpenses)} icon="trending_down"
          color="bg-red-500/15 text-red-400" delay="stagger-2" />
        <StatCard title="Balance" value={formatCurrency(d.balance)} icon="account_balance_wallet"
          color="bg-indigo-500/15 text-indigo-400"
          sub={d.balance >= 0 ? 'Positive balance ✓' : 'Spending exceeds income'}
          delay="stagger-3" />
        <StatCard title="Savings Rate" value={`${d.savingsRate}%`} icon="savings"
          color="bg-violet-500/15 text-violet-400"
          sub={d.savingsRate >= 20 ? 'Excellent saving!' : 'Aim for 20%+'}
          delay="stagger-4" />
        <StatCard title="Active Budgets" value={String(d.activeBudgets)} icon="dashboard"
          color="bg-cyan-500/15 text-cyan-400" delay="stagger-5" />
        <StatCard title="Upcoming Bills" value={String(d.upcomingBills)} icon="receipt"
          color="bg-yellow-500/15 text-yellow-400" delay="stagger-6" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Chart */}
        <div className="glass-card p-5 lg:col-span-2 flex flex-col justify-between">
          <div className="mb-5">
            <h2 className="font-display font-semibold text-white">Income vs Expenses</h2>
            <p className="text-xs text-on-surface-variant">Last 6 months trend</p>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ae176" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ae176" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffb4ab" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffb4ab" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8c909f' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8c909f' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#4ae176" strokeWidth={2} fill="url(#incGrad)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ffb4ab" strokeWidth={2} fill="url(#expGrad)" />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div className="mb-5">
            <h2 className="font-display font-semibold text-white">Expense Breakdown</h2>
            <p className="text-xs text-on-surface-variant">This month by category</p>
          </div>
          {d.categoryData.length > 0 ? (
            <div className="flex-1 flex flex-col justify-around">
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={d.categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                      paddingAngle={3} dataKey="value">
                      {d.categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {d.categoryData.slice(0, 4).map(cat => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-on-surface-variant">{cat.name}</span>
                    </div>
                    <span className="font-medium text-white">{formatCurrency(cat.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-on-surface-variant text-sm">No expenses yet</div>
          )}
        </div>
      </div>

      {/* Recent + Bills Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-white">Recent Transactions</h2>
              <p className="text-xs text-on-surface-variant">Latest activity</p>
            </div>
            <Link to="/app/expenses" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
              View all <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </div>
          {d.recent.length > 0 ? (
            <div className="space-y-3">
              {d.recent.map((tx: {
                id: string; type: 'income' | 'expense'; description: string;
                category: string; amount: number; date: string
              }) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-2 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm
                      ${tx.type === 'income' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                      <span className="material-symbols-outlined text-base">
                        {tx.type === 'income' ? 'trending_up' : 'trending_down'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white truncate max-w-[160px]">{tx.description}</div>
                      <div className="text-xs text-on-surface-variant">{formatDate(tx.date)}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl opacity-30 mb-2">receipt_long</span>
              <p className="text-sm">No transactions yet</p>
              <Link to="/app/expenses" className="text-xs text-primary mt-2 inline-flex items-center gap-1">
                Add your first expense
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Bills */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-white">Upcoming Bills</h2>
              <p className="text-xs text-on-surface-variant">Pending payments</p>
            </div>
            <Link to="/app/bills" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
              View all <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </div>
          {d.bills.length > 0 ? (
            <div className="space-y-3">
              {d.bills.map((bill: {
                id: string; bill_name: string; amount: number; due_date: string; status: string
              }) => (
                <div key={bill.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-2 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/15 text-yellow-400 flex items-center justify-center">
                      <span className="material-symbols-outlined text-base">receipt</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{bill.bill_name}</div>
                      <div className="text-xs text-on-surface-variant">Due {formatDate(bill.due_date)}</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-yellow-400">{formatCurrency(bill.amount)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl opacity-30 mb-2">receipt</span>
              <p className="text-sm">No upcoming bills</p>
              <Link to="/app/bills" className="text-xs text-primary mt-2 inline-flex items-center gap-1">
                Add a bill reminder
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-5">
        <h2 className="font-display font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Expense', to: '/app/expenses', icon: 'trending_down', color: 'from-red-500/20 to-red-600/10 border-red-500/20 hover:border-red-500/40', iconColor: 'text-red-400' },
            { label: 'Add Income', to: '/app/income', icon: 'trending_up', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 hover:border-emerald-500/40', iconColor: 'text-emerald-400' },
            { label: 'Set Budget', to: '/app/budgets', icon: 'payments', color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20 hover:border-indigo-500/40', iconColor: 'text-indigo-400' },
            { label: 'New Goal', to: '/app/savings', icon: 'savings', color: 'from-violet-500/20 to-violet-600/10 border-violet-500/20 hover:border-violet-500/40', iconColor: 'text-violet-400' },
          ].map(action => (
            <Link
              key={action.label}
              to={action.to}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border bg-gradient-to-br ${action.color} transition-all duration-200 hover:scale-[1.03]`}
            >
              <span className={`material-symbols-outlined text-2xl ${action.iconColor}`}>{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
