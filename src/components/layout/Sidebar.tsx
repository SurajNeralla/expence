import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: 'space_dashboard', label: 'Dashboard', to: '/app/dashboard' },
  { icon: 'receipt_long', label: 'Transactions', to: '/app/expenses' },
  { icon: 'account_balance', label: 'Budgets', to: '/app/budgets' },
  { icon: 'trending_up', label: 'Savings', to: '/app/savings' },
  { icon: 'calendar_today', label: 'Subscriptions', to: '/app/subscriptions' },
  { icon: 'auto_awesome', label: 'AI Insights', to: '/app/insights' },
  { icon: 'query_stats', label: 'Analytics', to: '/app/analytics' },
  { icon: 'notifications', label: 'Notifications', to: '/app/notifications' },
]

const bottomItems = [
  { icon: 'person', label: 'Profile', to: '/app/profile' },
  { icon: 'settings', label: 'Settings', to: '/app/settings' },
]

export default function Sidebar() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <aside
      className="hidden lg:flex flex-col h-screen p-4 gap-6 bg-card w-[250px] fixed left-0 top-0 border-r border-border shadow-xl z-50 text-foreground"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 pl-1">
        <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
        <span className="font-headline-lg text-headline-lg text-primary font-bold">Xpense</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              'flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 text-sm font-medium',
              isActive && 'bg-accent text-primary border-r-4 border-primary'
            )}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom & User Card */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="space-y-1">
          {bottomItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 text-sm font-medium',
                isActive && 'bg-accent text-primary border-r-4 border-primary'
              )}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => { signOut(); navigate('/login') }}
            className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {profile && (
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <div className="w-11 h-11 rounded-full border-2 border-primary overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center text-primary font-bold">
              {profile.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body-md text-sm text-foreground font-bold truncate">{profile.full_name}</p>
              <p className="font-label-md text-xs text-primary truncate">Premium Member</p>
            </div>
          </div>
        )}
        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest text-center">v2.4.0</p>
      </div>
    </aside>
  )
}
