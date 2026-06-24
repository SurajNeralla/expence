import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Loader2, CreditCard, RefreshCw } from 'lucide-react'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { formatCurrency, formatDate, isDueSoon } from '@/lib/utils'
import type { SubscriptionForm, Subscription } from '@/types'

const POPULAR = [
  { name: 'Netflix', icon: '🎬' }, { name: 'Spotify', icon: '🎵' },
  { name: 'YouTube Premium', icon: '▶️' }, { name: 'Amazon Prime', icon: '📦' },
  { name: 'Hotstar', icon: '⭐' }, { name: 'Swiggy One', icon: '🍔' }
]

const EMPTY: SubscriptionForm = {
  name: '', cost: 0, renewal_date: '', category: 'Entertainment', is_active: true
}

function SubModal({ open, onClose, onSave, initial, loading }: {
  open: boolean; onClose: () => void; onSave: (f: SubscriptionForm) => void; initial?: Subscription; loading: boolean
}) {
  const [form, setForm] = useState<SubscriptionForm>(initial ? {
    name: initial.name, cost: initial.cost, renewal_date: initial.renewal_date,
    category: initial.category || 'Entertainment', is_active: initial.is_active
  } : EMPTY)

  if (!open) return null
  const set = (k: keyof SubscriptionForm, v: SubscriptionForm[keyof SubscriptionForm]) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 animate-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold">{initial ? 'Edit Subscription' : 'Add Subscription'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent/80 text-muted-foreground transition-colors"><X size={18} /></button>
        </div>
        {/* Quick add */}
        {!initial && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Quick Add:</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map(p => (
                <button key={p.name} type="button" onClick={() => set('name', p.name)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                  {p.icon} {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Service Name</label>
            <input type="text" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g., Netflix"
              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Monthly Cost (₹)</label>
              <input type="number" min="0" step="0.01" required value={form.cost || ''} onChange={e => set('cost', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Renewal Date</label>
              <input type="date" required value={form.renewal_date} onChange={e => set('renewal_date', e.target.value)}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary" />
            <label htmlFor="active" className="text-sm">Active subscription</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border/60 rounded-lg text-sm hover:bg-accent/50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : (initial ? 'Update' : 'Add Subscription')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Subscriptions() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Subscription | undefined>()
  const { subscriptions, isLoading, addSubscription, updateSubscription, deleteSubscription, monthlyTotal } = useSubscriptions()

  const openAdd = () => { setEditing(undefined); setModalOpen(true) }
  const openEdit = (s: Subscription) => { setEditing(s); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(undefined) }

  const handleSave = (form: SubscriptionForm) => {
    if (editing) updateSubscription.mutate({ id: editing.id, data: form }, { onSuccess: closeModal })
    else addSubscription.mutate(form, { onSuccess: closeModal })
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">Track your recurring payments</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all hover:scale-[1.02]">
          <Plus size={16} /> Add Subscription
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold text-indigo-400">{formatCurrency(monthlyTotal)}</div>
          <div className="text-xs text-muted-foreground mt-1">Monthly Cost</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold">{subscriptions.filter(s => s.is_active).length}</div>
          <div className="text-xs text-muted-foreground mt-1">Active</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-xl font-display font-bold text-muted-foreground">{formatCurrency(monthlyTotal * 12)}</div>
          <div className="text-xs text-muted-foreground mt-1">Yearly Cost</div>
        </div>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : subscriptions.length === 0 ? (
        <div className="glass-card text-center py-16 text-muted-foreground">
          <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No subscriptions tracked</p>
          <button onClick={openAdd} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition-colors">
            <Plus size={15} /> Add Subscription
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map(sub => {
            const dueSoon = isDueSoon(sub.renewal_date)
            return (
              <div key={sub.id} className={`glass-card p-5 transition-all hover:border-indigo-500/30 ${!sub.is_active ? 'opacity-60' : ''} ${dueSoon ? 'border-yellow-500/30' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 flex items-center justify-center">
                      <CreditCard size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{sub.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full ${sub.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-500/15 text-gray-400'}`}>
                          {sub.is_active ? '● Active' : '○ Inactive'}
                        </span>
                        {dueSoon && <span className="badge-pending">Due Soon</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(sub)} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Edit2 size={13} /></button>
                    <button onClick={() => deleteSubscription.mutate(sub.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RefreshCw size={11} />
                    <span>Renews {formatDate(sub.renewal_date)}</span>
                  </div>
                  <div className="text-base font-bold text-indigo-400">{formatCurrency(sub.cost)}/mo</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <SubModal open={modalOpen} onClose={closeModal} onSave={handleSave} initial={editing}
        loading={addSubscription.isPending || updateSubscription.isPending} />
    </div>
  )
}
