import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Loader2, Target } from 'lucide-react'
import { useSavings } from '@/hooks/useSavings'
import { formatCurrency, formatDate, getPercentage, getDaysRemaining } from '@/lib/utils'
import type { SavingsGoalForm, SavingsGoal } from '@/types'

const GOAL_ICONS = ['🏠', '💻', '🚗', '✈️', '🏖️', '📚', '💊', '🎯', '💰', '🏋️']

const EMPTY: SavingsGoalForm = {
  goal_name: '', target_amount: 0, current_amount: 0,
  target_date: '', icon: '🎯'
}

function GoalModal({ open, onClose, onSave, initial, loading }: {
  open: boolean; onClose: () => void; onSave: (f: SavingsGoalForm) => void; initial?: SavingsGoal; loading: boolean
}) {
  const [form, setForm] = useState<SavingsGoalForm>(initial ? {
    goal_name: initial.goal_name, target_amount: initial.target_amount,
    current_amount: initial.current_amount, target_date: initial.target_date,
    icon: initial.icon || '🎯'
  } : EMPTY)

  if (!open) return null
  const set = (k: keyof SavingsGoalForm, v: SavingsGoalForm[keyof SavingsGoalForm]) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 animate-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold">{initial ? 'Edit Goal' : 'New Savings Goal'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent/80 text-muted-foreground transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
          {/* Icon picker */}
          <div>
            <label className="block text-sm font-medium mb-2">Choose Icon</label>
            <div className="flex flex-wrap gap-2">
              {GOAL_ICONS.map(icon => (
                <button key={icon} type="button" onClick={() => set('icon', icon)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all
                    ${form.icon === icon ? 'bg-primary/20 ring-2 ring-primary scale-110' : 'bg-secondary/50 hover:bg-accent/80'}`}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Goal Name</label>
            <input type="text" required value={form.goal_name} onChange={e => set('goal_name', e.target.value)} placeholder="e.g., Buy Laptop"
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Target Amount (₹)</label>
              <input type="number" min="0" required value={form.target_amount || ''} onChange={e => set('target_amount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" placeholder="50000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Current Savings (₹)</label>
              <input type="number" min="0" value={form.current_amount || ''} onChange={e => set('current_amount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Target Date</label>
            <input type="date" required value={form.target_date} onChange={e => set('target_date', e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border/60 rounded-lg text-sm hover:bg-accent/50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : (initial ? 'Update' : 'Create Goal')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SavingsGoals() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SavingsGoal | undefined>()
  const { goals, isLoading, addGoal, updateGoal, deleteGoal } = useSavings()

  const openAdd = () => { setEditing(undefined); setModalOpen(true) }
  const openEdit = (g: SavingsGoal) => { setEditing(g); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(undefined) }

  const handleSave = (form: SavingsGoalForm) => {
    if (editing) updateGoal.mutate({ id: editing.id, data: form }, { onSuccess: closeModal })
    else addGoal.mutate(form, { onSuccess: closeModal })
  }

  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0)
  const totalSaved = goals.reduce((s, g) => s + g.current_amount, 0)

  return (
    <div className="space-y-6 animate-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Savings Goals</h1>
          <p className="page-subtitle">Work towards your financial dreams</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-violet-500/20">
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold text-violet-400">{formatCurrency(totalSaved)}</div>
          <div className="text-xs text-muted-foreground mt-1">Total Saved</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold">{goals.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Active Goals</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold text-muted-foreground">{formatCurrency(totalTarget - totalSaved)}</div>
          <div className="text-xs text-muted-foreground mt-1">Still Needed</div>
        </div>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : goals.length === 0 ? (
        <div className="glass-card text-center py-16 text-muted-foreground">
          <Target size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No savings goals yet</p>
          <p className="text-sm mt-1">Set a goal and start saving towards it</p>
          <button onClick={openAdd} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 text-violet-400 rounded-lg text-sm hover:bg-violet-500/30 transition-colors">
            <Plus size={15} /> Create Goal
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(goal => {
            const pct = getPercentage(goal.current_amount, goal.target_amount)
            const remaining = goal.target_amount - goal.current_amount
            const days = getDaysRemaining(goal.target_date)
            const completed = goal.current_amount >= goal.target_amount

            return (
              <div key={goal.id} className={`glass-card p-5 transition-all duration-300 hover:border-violet-500/30 ${completed ? 'border-emerald-500/30' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{goal.icon || '🎯'}</div>
                    <div>
                      <div className="font-semibold text-sm">{goal.goal_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {completed ? '🎉 Goal achieved!' : `${days > 0 ? `${days} days left` : 'Overdue'}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(goal)} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Edit2 size={13} /></button>
                    <button onClick={() => deleteGoal.mutate(goal.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>

                {/* Progress ring-style bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{formatCurrency(goal.current_amount)} saved</span>
                    <span className="font-bold text-violet-400">{pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${pct}%`,
                      background: completed ? '#10b981' : 'linear-gradient(90deg, #8b5cf6, #6366f1)'
                    }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Target: <span className="text-foreground font-medium">{formatCurrency(goal.target_amount)}</span></span>
                  {!completed && <span className="text-muted-foreground">{formatCurrency(remaining)} to go</span>}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Target date: {formatDate(goal.target_date)}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <GoalModal open={modalOpen} onClose={closeModal} onSave={handleSave} initial={editing}
        loading={addGoal.isPending || updateGoal.isPending} />
    </div>
  )
}
