import { useState, useEffect } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { useExpenses } from '@/hooks/useExpenses'
import { formatCurrency, formatDate, EXPENSE_CATEGORIES, PAYMENT_METHODS, exportToCSV } from '@/lib/utils'
import type { ExpenseForm, Expense } from '@/types'
import { cn } from '@/lib/utils'

const EMPTY_FORM: ExpenseForm = {
  amount: 0, category: 'Food', description: '', payment_method: 'UPI', date: new Date().toISOString().split('T')[0], tags: []
}

const QUICK_CATEGORIES = ['all', 'Food', 'Transport', 'Rent', 'Entertainment', 'Utilities']

// Category Icon Mapping
const CATEGORY_ICONS: { [key: string]: string } = {
  Food: 'restaurant',
  Transport: 'directions_car',
  Rent: 'home',
  Shopping: 'shopping_bag',
  Utilities: 'bolt',
  Education: 'school',
  Entertainment: 'sports_esports',
  Health: 'medical_services',
  Travel: 'flight',
  Other: 'payments'
}

// Category Color Badge classes
const CATEGORY_COLORS_M3: { [key: string]: string } = {
  Food: 'bg-secondary-container/30 text-secondary',
  Transport: 'bg-primary-container/30 text-primary',
  Rent: 'bg-tertiary-container/30 text-tertiary',
  Shopping: 'bg-secondary-container/30 text-secondary',
  Utilities: 'bg-primary-container/30 text-primary',
  Education: 'bg-tertiary-container/30 text-tertiary',
  Entertainment: 'bg-secondary-container/30 text-secondary',
  Health: 'bg-emerald-500/15 text-emerald-400',
  Travel: 'bg-primary-container/30 text-primary',
  Other: 'bg-white/10 text-on-surface-variant'
}

function ExpenseModal({ open, onClose, onSave, initial, loading }: {
  open: boolean; onClose: () => void; onSave: (f: ExpenseForm) => void; initial?: Expense; loading: boolean
}) {
  const [form, setForm] = useState<ExpenseForm>(initial ? {
    amount: initial.amount, category: initial.category, description: initial.description,
    payment_method: initial.payment_method, date: initial.date, tags: initial.tags || []
  } : EMPTY_FORM)

  if (!open) return null

  const set = (k: keyof ExpenseForm, v: ExpenseForm[keyof ExpenseForm]) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 animate-in relative z-50">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold text-white">{initial ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Amount (₹)</label>
            <input type="number" min="0" step="0.01" required value={form.amount || ''} onChange={e => set('amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/5 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary/50 transition-colors" placeholder="0.00" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full px-3 py-2.5 bg-[#101415] border border-white/5 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary/50 transition-colors">
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Payment Method</label>
              <select value={form.payment_method} onChange={e => set('payment_method', e.target.value)}
                className="w-full px-3 py-2.5 bg-[#101415] border border-white/5 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary/50 transition-colors">
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Description</label>
            <input type="text" required value={form.description} onChange={e => set('description', e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/5 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary/50 transition-colors" placeholder="What did you spend on?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Date</label>
            <input type="date" required value={form.date} onChange={e => set('date', e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/5 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary/50 transition-colors" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-white/10 rounded-lg text-sm hover:bg-white/5 transition-colors text-white">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary-container font-bold rounded-lg text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : (initial ? 'Update' : 'Add Transaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Expenses() {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Expense | undefined>()

  const { expenses, isLoading, addExpense, updateExpense, deleteExpense, totalExpenses } = useExpenses({
    category: filterCat, search
  })

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

  const openAdd = () => { setEditing(undefined); setModalOpen(true) }
  const openEdit = (e: Expense) => { setEditing(e); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(undefined) }

  const handleSave = (form: ExpenseForm) => {
    if (editing) {
      updateExpense.mutate({ id: editing.id, data: form }, { onSuccess: closeModal })
    } else {
      addExpense.mutate(form, { onSuccess: closeModal })
    }
  }

  const handleExport = () => {
    exportToCSV(expenses.map(e => ({
      Date: e.date, Description: e.description, Category: e.category,
      Amount: e.amount, 'Payment Method': e.payment_method
    })), 'expenses')
  }

  // Grouping logic for date headers
  const getHeaderDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    
    const formatted = formatDate(dateStr)
    if (dateStr === today) return `Today, ${formatted}`
    if (dateStr === yesterday) return `Yesterday, ${formatted}`
    return formatted
  }

  const groupedExpenses: { [key: string]: Expense[] } = {}
  expenses.forEach(e => {
    const header = getHeaderDate(e.date)
    if (!groupedExpenses[header]) groupedExpenses[header] = []
    groupedExpenses[header].push(e)
  })

  return (
    <div className="space-y-6 animate-in text-on-surface">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Transactions</h1>
          <p className="text-sm text-on-surface-variant mt-1">Track and manage your spending</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl text-sm hover:bg-accent transition-colors font-bold text-foreground">
            <span className="material-symbols-outlined text-sm">download</span> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Header */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-xl flex flex-col justify-center min-h-[120px]">
          <p className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">Total Expenses This Month</p>
          <h2 className="text-2xl font-bold text-primary mt-1">{formatCurrency(totalExpenses)}</h2>
        </div>
        <div className="glass-card p-6 rounded-xl flex flex-col justify-center min-h-[120px]">
          <p className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">Transactions Count</p>
          <h2 className="text-2xl font-bold text-foreground mt-1">{expenses.length}</h2>
        </div>
        <div className="glass-card p-6 rounded-xl flex flex-col justify-center min-h-[120px]">
          <p className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">Avg Transaction Cost</p>
          <h2 className="text-2xl font-bold text-tertiary mt-1">
            {expenses.length > 0 ? formatCurrency(totalExpenses / expenses.length) : '₹0'}
          </h2>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="space-y-4 py-2">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="relative w-full md:flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary/50 transition-all font-body-md text-sm text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Search transactions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
            />
          </div>
          {/* Category Quick Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1">
            {QUICK_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={cn(
                  'px-4 py-2 rounded-full font-label-md text-xs whitespace-nowrap transition-all active:scale-95 border',
                  filterCat === cat
                    ? 'bg-primary text-primary-foreground font-bold border-transparent'
                    : 'bg-accent text-muted-foreground hover:bg-accent/80 border-border'
                )}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grouped Date Expense List */}
      <section className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-primary" /></div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant glass-card">
            <span className="material-symbols-outlined text-4xl opacity-30 mb-2">payments</span>
            <p className="font-semibold text-foreground">No expenses found</p>
            <p className="text-xs mt-1">Add your first expense transaction to begin tracking</p>
            <button onClick={openAdd} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary/20 text-primary font-bold rounded-xl text-xs hover:bg-primary/30 transition-colors">
              <Plus size={14} /> Add Transaction
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.keys(groupedExpenses).map(dateHeader => (
              <div key={dateHeader} className="space-y-2">
                {/* Date header */}
                <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider pl-1">{dateHeader}</p>
                {/* Items */}
                <div className="space-y-2">
                  {groupedExpenses[dateHeader].map(expense => {
                    const catIcon = CATEGORY_ICONS[expense.category] || 'payments'
                    const catColors = CATEGORY_COLORS_M3[expense.category] || 'bg-white/10 text-on-surface-variant'
                    
                    return (
                      <div
                        key={expense.id}
                        onClick={() => openEdit(expense)}
                        className="glass-card hover:bg-accent/50 p-4 rounded-xl flex items-center justify-between transition-all group cursor-pointer border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', catColors)}>
                            <span className="material-symbols-outlined text-lg">{catIcon}</span>
                          </div>
                          <div>
                            <p className="font-body-md text-sm text-foreground font-bold">{expense.description}</p>
                            <p className="font-label-md text-xs text-on-surface-variant">
                              {expense.category} • {expense.payment_method}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="font-body-md text-sm text-error font-bold">-{formatCurrency(expense.amount)}</p>
                            <p className="text-[10px] text-on-surface-variant font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to Edit
                            </p>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); deleteExpense.mutate(expense.id) }}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-on-surface-variant hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={openAdd}
        className="fixed bottom-24 right-4 md:bottom-12 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary shadow-2xl flex items-center justify-center text-primary-foreground active:scale-90 transition-transform z-40 group border border-border"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
        <div className="absolute -top-12 right-0 bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
          Add New Expense
        </div>
      </button>

      <ExpenseModal
        open={modalOpen} onClose={closeModal} onSave={handleSave} initial={editing}
        loading={addExpense.isPending || updateExpense.isPending}
      />
    </div>
  )
}
