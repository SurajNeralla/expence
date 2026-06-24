import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, TrendingUp, TrendingDown, Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { formatCurrency, CATEGORY_COLORS } from '@/lib/utils'
import type { AIInsight } from '@/types'

function generateInsights(data: {
  currentExpenses: number; prevExpenses: number;
  currentIncome: number; savingsRate: number;
  categoryData: { name: string; value: number }[]
  budgets: { category: string; budget_amount: number; spent: number }[]
  subscriptionCost: number;
  overdueBills: number;
}): AIInsight[] {
  const insights: AIInsight[] = []
  const { currentExpenses, prevExpenses, currentIncome, savingsRate, categoryData, budgets, subscriptionCost, overdueBills } = data

  // Spending change
  if (prevExpenses > 0) {
    const change = ((currentExpenses - prevExpenses) / prevExpenses) * 100
    if (Math.abs(change) > 5) {
      insights.push({
        id: '1',
        title: change > 0 ? 'Spending Increased' : 'Spending Decreased',
        description: `Your spending ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% compared to last month. ${change > 0 ? 'Consider reviewing your expenses.' : 'Great discipline this month!'}`,
        type: change > 0 ? 'warning' : 'success',
        icon: change > 0 ? '📈' : '📉',
        value: `${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
        change
      })
    }
  }

  // Savings rate
  if (savingsRate >= 30) {
    insights.push({ id: '2', title: 'Excellent Savings Rate!', description: `You're saving ${savingsRate}% of your income. That's above the recommended 20% — keep it up!`, type: 'success', icon: '🏆', value: `${savingsRate}%` })
  } else if (savingsRate < 10 && currentIncome > 0) {
    insights.push({ id: '2', title: 'Low Savings Rate', description: `Your savings rate is ${savingsRate}%. Aim to save at least 20% of your income for financial security.`, type: 'warning', icon: '💡', value: `${savingsRate}%` })
  }

  // Top spending category
  const topCat = categoryData[0]
  if (topCat) {
    const pct = currentExpenses > 0 ? ((topCat.value / currentExpenses) * 100).toFixed(0) : 0
    insights.push({
      id: '3',
      title: `Highest: ${topCat.name}`,
      description: `${topCat.name} accounts for ${pct}% of your monthly expenses (${formatCurrency(topCat.value)}). ${Number(pct) > 40 ? 'This seems high — consider reducing it.' : 'This is within a healthy range.'}`,
      type: Number(pct) > 40 ? 'warning' : 'info',
      icon: '🏷️',
      value: `${pct}%`
    })
  }

  // Budget alerts
  const overBudget = budgets.filter(b => b.spent > b.budget_amount)
  if (overBudget.length > 0) {
    overBudget.forEach(b => {
      insights.push({
        id: `budget-${b.category}`,
        title: `Budget Exceeded: ${b.category}`,
        description: `You've spent ${formatCurrency(b.spent)} vs your ${formatCurrency(b.budget_amount)} budget for ${b.category}. You're ${formatCurrency(b.spent - b.budget_amount)} over limit.`,
        type: 'danger',
        icon: '⚠️',
        value: formatCurrency(b.spent - b.budget_amount)
      })
    })
  }

  // Subscription cost
  if (subscriptionCost > 0) {
    const subPct = currentIncome > 0 ? ((subscriptionCost / currentIncome) * 100).toFixed(1) : 0
    insights.push({
      id: '5',
      title: 'Subscription Overview',
      description: `Your subscriptions cost ${formatCurrency(subscriptionCost)}/month (${subPct}% of income). ${Number(subPct) > 10 ? 'Consider reviewing which ones you actively use.' : 'Your subscription spending looks reasonable.'}`,
      type: Number(subPct) > 10 ? 'warning' : 'info',
      icon: '📱',
      value: formatCurrency(subscriptionCost) + '/mo'
    })
  }

  // Overdue bills
  if (overdueBills > 0) {
    insights.push({
      id: '6',
      title: `${overdueBills} Overdue Bill${overdueBills > 1 ? 's' : ''}!`,
      description: `You have ${overdueBills} overdue bill${overdueBills > 1 ? 's' : ''} that need immediate attention. Late payments can result in penalties.`,
      type: 'danger',
      icon: '🚨',
      value: `${overdueBills} bills`
    })
  }

  // Positive case - no issues
  if (insights.filter(i => i.type === 'danger' || i.type === 'warning').length === 0) {
    insights.push({
      id: 'all-good',
      title: 'Finances Look Great! 🎉',
      description: 'Your spending is on track, savings rate is healthy, and no budgets exceeded. Keep up the excellent financial discipline!',
      type: 'success',
      icon: '🌟',
      value: 'All Good'
    })
  }

  return insights
}

function InsightCard({ insight }: { insight: AIInsight }) {
  const typeConfig = {
    success: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle },
    warning: { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', icon: AlertTriangle },
    danger: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', icon: AlertTriangle },
    info: { bg: 'bg-indigo-500/10 border-indigo-500/20', text: 'text-indigo-400', icon: Info },
  }
  const conf = typeConfig[insight.type]
  const Icon = conf.icon

  return (
    <div className={`glass-card p-5 border ${conf.bg} hover:scale-[1.01] transition-all duration-200`}>
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0">{insight.icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-semibold text-sm">{insight.title}</h3>
            {insight.value && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${conf.bg} ${conf.text}`}>
                {insight.value}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </div>
  )
}

export default function AIInsights() {
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['ai-insights', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const now = new Date()
      const mStart = format(startOfMonth(now), 'yyyy-MM-dd')
      const mEnd = format(endOfMonth(now), 'yyyy-MM-dd')
      const prevStart = format(startOfMonth(subMonths(now, 1)), 'yyyy-MM-dd')
      const prevEnd = format(endOfMonth(subMonths(now, 1)), 'yyyy-MM-dd')

      const [currExp, prevExp, currInc, budgetsRes, subsRes, billsRes] = await Promise.all([
        supabase.from('expenses').select('category,amount').eq('user_id', user!.id).gte('date', mStart).lte('date', mEnd),
        supabase.from('expenses').select('amount').eq('user_id', user!.id).gte('date', prevStart).lte('date', prevEnd),
        supabase.from('income').select('amount').eq('user_id', user!.id).gte('date', mStart).lte('date', mEnd),
        supabase.from('budgets').select('*').eq('user_id', user!.id).eq('month', format(now, 'yyyy-MM')),
        supabase.from('subscriptions').select('cost').eq('user_id', user!.id).eq('is_active', true),
        supabase.from('bills').select('status').eq('user_id', user!.id).eq('status', 'overdue'),
      ])

      const currentExpenses = (currExp.data || []).reduce((s: number, e: { amount: number }) => s + e.amount, 0)
      const prevExpenses = (prevExp.data || []).reduce((s: number, e: { amount: number }) => s + e.amount, 0)
      const currentIncome = (currInc.data || []).reduce((s: number, i: { amount: number }) => s + i.amount, 0)
      const savingsRate = currentIncome > 0 ? Math.round(((currentIncome - currentExpenses) / currentIncome) * 100) : 0

      // Category breakdown
      const catMap: Record<string, number> = {}
      ;(currExp.data || []).forEach((e: { category: string; amount: number }) => {
        catMap[e.category] = (catMap[e.category] || 0) + e.amount
      })
      const categoryData = Object.entries(catMap).map(([name, value]) => ({
        name, value, color: CATEGORY_COLORS[name] || '#6b7280'
      })).sort((a, b) => b.value - a.value)

      // Budget overspend check
      const budgetsWithSpend = (budgetsRes.data || []).map((b: { category: string; budget_amount: number }) => ({
        ...b, spent: catMap[b.category] || 0
      }))

      const subscriptionCost = (subsRes.data || []).reduce((s: number, sub: { cost: number }) => s + sub.cost, 0)
      const overdueBills = (billsRes.data || []).length

      const insights = generateInsights({
        currentExpenses, prevExpenses, currentIncome, savingsRate,
        categoryData, budgets: budgetsWithSpend, subscriptionCost, overdueBills
      })

      return { insights, currentExpenses, currentIncome, savingsRate }
    },
    staleTime: 60000
  })

  return (
    <div className="space-y-6 animate-in">
      <div className="page-header">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
            <Lightbulb size={16} />
          </div>
          <h1 className="page-title">AI Financial Insights</h1>
        </div>
        <p className="page-subtitle">Smart analysis of your spending patterns and financial health</p>
      </div>

      {/* Month summary */}
      {data && (
        <div className="glass-card p-5 border border-indigo-500/20" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🤖</span>
            <div>
              <div className="font-display font-semibold">AI Analysis for {format(new Date(), 'MMMM yyyy')}</div>
              <div className="text-xs text-muted-foreground">Based on your actual financial data</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">{formatCurrency(data.currentExpenses)}</div>
              <div className="text-xs text-muted-foreground">Month Expenses</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-400">{formatCurrency(data.currentIncome)}</div>
              <div className="text-xs text-muted-foreground">Month Income</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${data.savingsRate >= 20 ? 'text-indigo-400' : 'text-yellow-400'}`}>{data.savingsRate}%</div>
              <div className="text-xs text-muted-foreground">Savings Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">{data?.insights.length || 0} Insights Generated</h2>
            <div className="text-xs text-muted-foreground flex items-center gap-1"><Info size={12} /> Updated now</div>
          </div>
          {(data?.insights || []).map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="glass-card p-5">
        <h2 className="font-display font-semibold mb-4">💡 Financial Tips</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { tip: 'Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings.', icon: '📊' },
            { tip: 'Build an emergency fund of 3-6 months of expenses.', icon: '🛡️' },
            { tip: 'Review subscriptions every 3 months to cut unused ones.', icon: '✂️' },
            { tip: 'Automate your savings transfers on salary day.', icon: '⚡' },
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-accent/30">
              <span className="text-xl">{t.icon}</span>
              <p className="text-sm text-muted-foreground">{t.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
