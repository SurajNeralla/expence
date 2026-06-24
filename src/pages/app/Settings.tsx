import { useState } from 'react'
import { Moon, Sun, Bell, Shield, Trash2, Download, Globe } from 'lucide-react'

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState({
    budgetAlerts: true, billReminders: true, savingsMilestones: true, weeklyReport: false
  })
  const [currency, setCurrency] = useState('INR')

  const toggleTheme = () => {
    setDarkMode(d => !d)
    document.documentElement.classList.toggle('light')
  }

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(n => ({ ...n, [key]: !n[key] }))
  }

  return (
    <div className="space-y-6 animate-in max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Customize your Expense Tracker experience</p>
      </div>

      {/* Appearance */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <Sun size={16} className="text-indigo-400" />
          </div>
          <h3 className="font-display font-semibold">Appearance</h3>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="text-sm font-medium">Dark Mode</div>
            <div className="text-xs text-muted-foreground">Switch between dark and light theme</div>
          </div>
          <button onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-muted'}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-6' : ''}`} />
          </button>
        </div>
        <div className="flex items-center justify-between py-3 border-t border-border/30">
          <div>
            <div className="text-sm font-medium flex items-center gap-2"><Globe size={14} /> Currency</div>
            <div className="text-xs text-muted-foreground">Choose your preferred currency</div>
          </div>
          <select value={currency} onChange={e => setCurrency(e.target.value)}
            className="px-3 py-1.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50">
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/15 flex items-center justify-center">
            <Bell size={16} className="text-yellow-400" />
          </div>
          <h3 className="font-display font-semibold">Notifications</h3>
        </div>
        <div className="space-y-0">
          {[
            { key: 'budgetAlerts', label: 'Budget Exceeded Alerts', desc: 'Get notified when you overspend a budget' },
            { key: 'billReminders', label: 'Bill Reminders', desc: 'Reminders 3 days before bills are due' },
            { key: 'savingsMilestones', label: 'Savings Milestones', desc: 'Celebrate when you hit savings targets' },
            { key: 'weeklyReport', label: 'Weekly Summary', desc: 'Get a weekly overview of your finances' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
              <div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
              <button onClick={() => toggle(key as keyof typeof notifications)}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifications[key as keyof typeof notifications] ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[key as keyof typeof notifications] ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Shield size={16} className="text-emerald-400" />
          </div>
          <h3 className="font-display font-semibold">Privacy & Data</h3>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 py-3 px-4 rounded-lg bg-secondary/30 hover:bg-accent/50 transition-colors text-left">
            <Download size={15} className="text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Export All Data</div>
              <div className="text-xs text-muted-foreground">Download all your financial data as CSV</div>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 py-3 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-left border border-red-500/20">
            <Trash2 size={15} className="text-red-400" />
            <div>
              <div className="text-sm font-medium text-red-400">Delete Account</div>
              <div className="text-xs text-muted-foreground">Permanently delete your account and all data</div>
            </div>
          </button>
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">About</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between"><span>Version</span><span>1.0.0</span></div>
          <div className="flex justify-between"><span>Stack</span><span>React + Supabase + PWA</span></div>
          <div className="flex justify-between"><span>Author</span><span>Expense Tracker Team</span></div>
        </div>
      </div>
    </div>
  )
}
