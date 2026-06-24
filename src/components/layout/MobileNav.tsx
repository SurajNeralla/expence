import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const items = [
  { icon: 'dashboard', label: 'Home', to: '/app/dashboard' },
  { icon: 'query_stats', label: 'Analytics', to: '/app/analytics' },
  { icon: 'add_circle', label: 'Add', to: '/app/expenses' },
  { icon: 'payments', label: 'Budget', to: '/app/budgets' },
  { icon: 'savings', label: 'Goals', to: '/app/savings' },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-3 pb-safe bg-surface/70 backdrop-blur-xl border-t border-white/5 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.4)] z-50 rounded-t-xl text-on-surface">
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => cn(
            'flex flex-col items-center justify-center p-2 rounded-full active:scale-90 duration-150 transition-all text-on-surface-variant hover:text-primary',
            isActive && item.label === 'Add' ? 'bg-secondary-container text-on-secondary-container' : isActive ? 'text-primary' : 'text-on-surface-variant'
          )}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="font-label-md text-[10px] mt-0.5">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
