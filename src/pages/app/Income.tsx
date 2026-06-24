import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react'
import { useIncome } from '@/hooks/useIncome'
import { formatCurrency, formatDate, INCOME_SOURCES } from '@/lib/utils'
import type { IncomeForm, Income } from '@/types'

const EMPTY: IncomeForm = { amount: 0, source: 'Salary', notes: '', date: new Date().toISOString().split('T')[0] }

function IncomeModal({ open, onClose, onSave, initial, loading }: {
  open: boolean; onClose: () => void; onSave: (f: IncomeForm) => void; initial?: Income; loading: boolean
}) {
  const [form, setForm] = useState<IncomeForm>(initial ? {
    amount: initial.amount, source: initial.source, notes: initial.notes || '', date: initial.date
  } : EMPTY)

  if (!open) return null
  const set = (k: keyof IncomeForm, v: IncomeForm[keyof IncomeForm]) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 animate-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold">{initial ? 'Edit Income' : 'Add Income'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent/80 text-muted-foreground transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Amount (₹)</label>
            <input type="number" min="0" step="0.01" required value={form.amount || ''} onChange={e => set('amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Source</label>
            <select value={form.source} onChange={e => set('source', e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors">
              {INCOME_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Date</label>
            <input type="date" required value={form.date} onChange={e => set('date', e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Notes (optional)</label>
            <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Additional notes..."
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border/60 rounded-lg text-sm hover:bg-accent/50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : (initial ? 'Update' : 'Add Income')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const SOURCE_COLORS: Record<string, string> = {
  Salary: '#10b981', Freelancing: '#6366f1', Business: '#8b5cf6',
  Investment: '#06b6d4', Scholarship: '#f59e0b', Other: '#6b7280'
}

export default function Income() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Income | undefined>()
  const { incomes, isLoading, addIncome, updateIncome, deleteIncome, totalIncome } = useIncome()

  const openAdd = () => { setEditing(undefined); setModalOpen(true) }
  const openEdit = (i: Income) => { setEditing(i); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(undefined) }

  const handleSave = (form: IncomeForm) => {
    if (editing) updateIncome.mutate({ id: editing.id, data: form }, { onSuccess: closeModal })
    else addIncome.mutate(form, { onSuccess: closeModal })
  }

  const avgIncome = incomes.length > 0 ? totalIncome / incomes.length : 0

  return (
    <div className="space-y-6 animate-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Income</h1>
          <p className="page-subtitle">Track all your income sources</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/20">
          <Plus size={16} /> Add Income
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold text-emerald-400">{formatCurrency(totalIncome)}</div>
          <div className="text-xs text-muted-foreground mt-1">Total Income</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold">{incomes.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Entries</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold text-muted-foreground">{formatCurrency(avgIncome)}</div>
          <div className="text-xs text-muted-foreground mt-1">Average</div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-primary" /></div>
        ) : incomes.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-4xl mb-3">💰</div>
            <p className="font-medium">No income entries yet</p>
            <button onClick={openAdd} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors">
              <Plus size={15} /> Add Income
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Source</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Notes</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map(income => (
                  <tr key={income.id} className="border-b border-border/20 hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-muted-foreground whitespace-nowrap">{formatDate(income.date)}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border"
                        style={{ backgroundColor: (SOURCE_COLORS[income.source] || '#6b7280') + '20', color: SOURCE_COLORS[income.source] || '#6b7280', borderColor: (SOURCE_COLORS[income.source] || '#6b7280') + '40' }}>
                        {income.source}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground max-w-[200px] truncate">{income.notes || '—'}</td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-emerald-400">{formatCurrency(income.amount)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(income)} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => deleteIncome.mutate(income.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <IncomeModal open={modalOpen} onClose={closeModal} onSave={handleSave} initial={editing}
        loading={addIncome.isPending || updateIncome.isPending} />
    </div>
  )
}
