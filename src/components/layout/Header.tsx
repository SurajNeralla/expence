import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Sun, Moon } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'

export default function Header() {
  const [dark, setDark] = useState(true)
  const { unreadCount } = useNotifications()

  const toggleTheme = () => {
    setDark(d => !d)
    document.documentElement.classList.toggle('light')
  }

  return (
    <header
      className="sticky top-0 z-30 h-16 border-b border-border/50 flex items-center px-4 md:px-6 gap-4"
      style={{ background: 'rgba(15,15,26,0.85)', backdropFilter: 'blur(20px)' }}
    >
      {/* Mobile logo */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">₹</div>
        <span className="font-display font-bold text-sm">ExpenseTracker</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-lg hover:bg-accent/80 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link
          to="/app/notifications"
          className="relative p-2.5 rounded-lg hover:bg-accent/80 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
