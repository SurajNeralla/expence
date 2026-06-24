import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Loader2, CheckCircle, Receipt, AlertCircle } from 'lucide-react'
import { useBills } from '@/hooks/useBills'
import { formatCurrency, formatDate, isOverdue, isDueSoon } from '@/lib/utils'
import type { BillForm, Bill } from '@/types'

const BILL_CATEGORIES = ['Electricity', 'Water', 'Internet', 'Rent', 'EMI', 'Credit Card', 'Mobile', 'Gas', 'Other']

const EMPTY: BillForm = {
  bill_name: '', amount: 0, due_date: '', status: 'pending', category: 'Other', notes: ''
}

function BillModal({ open, onClose, onSave, initial, loading }: {
  open: boolean; onClose: () => void; onSave: (f: BillForm) => void; initial?: Bill; loading: boolean
}) {
  const [form, setForm] = useState<BillForm>(initial ? {
    bill_name: initial.bill_name, amount: initial.amount, due_date: initial.due_date,
    status: initial.status, category: initial.category || 'Other', notes: initial.notes || ''
  } : EMPTY)

  if (!open) return null
  const set = (k: keyof BillForm, v: BillForm[keyof BillForm]) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 animate-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold">{initial ? 'Edit Bill' : 'Add Bill'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent/80 text-muted-foreground transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Bill Name</label>
              <input type="text" required value={form.bill_name} onChange={e => set('bill_name', e.target.value)} placeholder="e.g., Electricity Bill"
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select value={form.category || 'Other'} onChange={e => set('category', e.target.value)}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors">
                {BILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Amount (₹)</label>
              <input type="number" min="0" step="0.01" required value={form.amount || ''} onChange={e => set('amount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Due Date</label>
              <input type="date" required value={form.due_date} onChange={e => set('due_date', e.target.value)}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value as 'pending' | 'paid' | 'overdue')}
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors">
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Notes</label>
            <input type="text" value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Optional notes"
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border/60 rounded-lg text-sm hover:bg-accent/50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : (initial ? 'Update' : 'Add Bill')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'paid') return <span className="badge-paid"><CheckCircle size={10} /> Paid</span>
  if (status === 'overdue') return <span className="badge-overdue"><AlertCircle size={10} /> Overdue</span>
  return <span className="badge-pending">● Pending</span>
}

export default function Bills() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Bill | undefined>()
  const [filterStatus, setFilterStatus] = useState('all')
  const { bills, isLoading, addBill, updateBill, deleteBill, markAsPaid } = useBills()

  const openAdd = () => { setEditing(undefined); setModalOpen(true) }
  const openEdit = (b: Bill) => { setEditing(b); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(undefined) }

  const handleSave = (form: BillForm) => {
    if (editing) updateBill.mutate({ id: editing.id, data: form }, { onSuccess: closeModal })
    else addBill.mutate(form, { onSuccess: closeModal })
  }

  const filtered = filterStatus === 'all' ? bills : bills.filter(b => b.status === filterStatus)
  const totalPending = bills.filter(b => b.status === 'pending').reduce((s, b) => s + b.amount, 0)
  const totalPaid = bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0)
  const overdueCnt = bills.filter(b => b.status === 'overdue').length

  return (
    <div className="space-y-6 animate-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Bills & Reminders</h1>
          <p className="page-subtitle">Never miss a payment deadline</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all hover:scale-[1.02]">
          <Plus size={16} /> Add Bill
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold text-yellow-400">{formatCurrency(totalPending)}</div>
          <div className="text-xs text-muted-foreground mt-1">Pending</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold text-emerald-400">{formatCurrency(totalPaid)}</div>
          <div className="text-xs text-muted-foreground mt-1">Paid</div>
        </div>
        <div className="stat-card text-center">
          <div className={`text-xl font-display font-bold ${overdueCnt > 0 ? 'text-red-400' : 'text-muted-foreground'}`}>{overdueCnt}</div>
          <div className="text-xs text-muted-foreground mt-1">Overdue</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'pending', 'paid', 'overdue'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize
              ${filterStatus === s ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-accent/50'}`}>
            {s === 'all' ? 'All Bills' : s}
          </button>
        ))}
      </div>

      {/* Bills list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card text-center py-16 text-muted-foreground">
          <Receipt size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No bills found</p>
          <button onClick={openAdd} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors">
            <Plus size={15} /> Add Bill
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(bill => {
            const overdue = bill.status === 'pending' && isOverdue(bill.due_date)
            const dueSoon = bill.status === 'pending' && isDueSoon(bill.due_date)

            return (
              <div key={bill.id} className={`glass-card p-4 flex items-center gap-4 transition-all hover:border-primary/20
                ${overdue ? 'border-red-500/30' : dueSoon ? 'border-yellow-500/30' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                  ${bill.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400' : overdue ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                  {bill.status === 'paid' ? <CheckCircle size={18} /> : <Receipt size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{bill.bill_name}</span>
                    <StatusBadge status={overdue && bill.status === 'pending' ? 'overdue' : bill.status} />
                    {dueSoon && !overdue && <span className="badge-pending text-orange-400 border-orange-500/20 bg-orange-500/15">Due soon!</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {bill.category} • Due {formatDate(bill.due_date)} {bill.notes && `• ${bill.notes}`}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-sm">{formatCurrency(bill.amount)}</div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {bill.status === 'pending' && (
                    <button onClick={() => markAsPaid.mutate(bill.id)} title="Mark as paid"
                      className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 transition-colors">
                      <CheckCircle size={14} />
                    </button>
                  )}
                  <button onClick={() => openEdit(bill)} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => deleteBill.mutate(bill.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <BillModal open={modalOpen} onClose={closeModal} onSave={handleSave} initial={editing}
        loading={addBill.isPending || updateBill.isPending} />
    </div>
  )
}
