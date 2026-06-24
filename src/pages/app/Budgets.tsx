import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Loader2, AlertTriangle } from 'lucide-react'
import { useBudgets } from '@/hooks/useBudgets'
import { useExpenses } from '@/hooks/useExpenses'
import { formatCurrency, getPercentage, EXPENSE_CATEGORIES, CATEGORY_COLORS, getCurrentMonthRange } from '@/lib/utils'
import { format } from 'date-fns'
import type { BudgetForm, Budget } from '@/types'

const EMPTY: BudgetForm = {
  category: 'Food',
  budget_amount: 0,
  month: format(new Date(), 'yyyy-MM')
}

function BudgetModal({ open, onClose, onSave, initial, loading }: {
  open: boolean; onClose: () => void; onSave: (f: BudgetForm) => void; initial?: Budget; loading: boolean
}) {
  const [form, setForm] = useState<BudgetForm>(initial ? {
    category: initial.category, budget_amount: initial.budget_amount, month: initial.month
  } : EMPTY)

  if (!open) return null
  const set = (k: keyof BudgetForm, v: BudgetForm[keyof BudgetForm]) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 animate-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold">{initial ? 'Edit Budget' : 'Create Budget'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent/80 text-muted-foreground transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors">
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Budget Amount (₹)</label>
            <input type="number" min="0" step="0.01" required value={form.budget_amount || ''} onChange={e => set('budget_amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" placeholder="5000.00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Month</label>
            <input type="month" required value={form.month} onChange={e => set('month', e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border/60 rounded-lg text-sm hover:bg-accent/50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : (initial ? 'Update' : 'Create Budget')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Budgets() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Budget | undefined>()
  const { budgets, isLoading, addBudget, updateBudget, deleteBudget } = useBudgets()
  const { start, end } = getCurrentMonthRange()
  const { expenses } = useExpenses({ startDate: start, endDate: end })

  // Calculate spent per category
  const spentByCategory: Record<string, number> = {}
  expenses.forEach(e => {
    spentByCategory[e.category] = (spentByCategory[e.category] || 0) + e.amount
  })

  const openAdd = () => { setEditing(undefined); setModalOpen(true) }
  const openEdit = (b: Budget) => { setEditing(b); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(undefined) }

  const handleSave = (form: BudgetForm) => {
    if (editing) updateBudget.mutate({ id: editing.id, data: form }, { onSuccess: closeModal })
    else addBudget.mutate(form, { onSuccess: closeModal })
  }

  const totalBudget = budgets.reduce((s, b) => s + b.budget_amount, 0)
  const totalSpent = budgets.reduce((s, b) => s + (spentByCategory[b.category] || 0), 0)

  return (
    <div className="space-y-6 animate-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Budgets</h1>
          <p className="page-subtitle">{format(new Date(), 'MMMM yyyy')} — Manage your spending limits</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/20">
          <Plus size={16} /> Create Budget
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold text-indigo-400">{formatCurrency(totalBudget)}</div>
          <div className="text-xs text-muted-foreground mt-1">Total Budget</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold text-red-400">{formatCurrency(totalSpent)}</div>
          <div className="text-xs text-muted-foreground mt-1">Total Spent</div>
        </div>
        <div className="stat-card text-center">
          <div className={`text-xl font-display font-bold ${totalBudget - totalSpent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(Math.abs(totalBudget - totalSpent))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{totalBudget - totalSpent >= 0 ? 'Remaining' : 'Over Budget'}</div>
        </div>
      </div>

      {/* Budget Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : budgets.length === 0 ? (
        <div className="glass-card text-center py-16 text-muted-foreground">
          <div className="text-4xl mb-3">💰</div>
          <p className="font-medium">No budgets created yet</p>
          <p className="text-sm mt-1">Set spending limits for each category</p>
          <button onClick={openAdd} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition-colors">
            <Plus size={15} /> Create Budget
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(budget => {
            const spent = spentByCategory[budget.category] || 0
            const pct = getPercentage(spent, budget.budget_amount)
            const remaining = budget.budget_amount - spent
            const isOver = spent > budget.budget_amount
            const color = CATEGORY_COLORS[budget.category] || '#6366f1'

            return (
              <div key={budget.id} className="glass-card p-5 hover:border-primary/20 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{budget.category}</div>
                      <div className="text-xs text-muted-foreground">{budget.month}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {isOver && <AlertTriangle size={14} className="text-red-400" />}
                    <button onClick={() => openEdit(budget)} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Edit2 size={13} /></button>
                    <button onClick={() => deleteBudget.mutate(budget.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>

                {/* Progress */}
                <div className="progress-bar mb-3">
                  <div className="progress-fill" style={{
                    width: `${pct}%`,
                    background: isOver ? '#ef4444' : `linear-gradient(90deg, ${color}, ${color}cc)`
                  }} />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Spent: <span className="font-medium text-foreground">{formatCurrency(spent)}</span></span>
                  <span className="font-semibold">{pct}%</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className={isOver ? 'text-red-400 font-medium' : 'text-emerald-400'}>
                    {isOver ? `₹${Math.abs(remaining).toLocaleString()} over budget!` : `₹${remaining.toLocaleString()} remaining`}
                  </span>
                  <span className="text-muted-foreground">of {formatCurrency(budget.budget_amount)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <BudgetModal open={modalOpen} onClose={closeModal} onSave={handleSave} initial={editing}
        loading={addBudget.isPending || updateBudget.isPending} />
    </div>
  )
}
