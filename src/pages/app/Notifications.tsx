import { useNotifications } from '@/hooks/useNotifications'
import { Bell, CheckCheck, Loader2, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'
import { formatDateRelative } from '@/lib/utils'
import type { Notification } from '@/types'

function NotificationIcon({ type }: { type: string }) {
  if (type === 'success') return <CheckCircle size={16} className="text-emerald-400" />
  if (type === 'warning') return <AlertTriangle size={16} className="text-yellow-400" />
  if (type === 'danger') return <AlertCircle size={16} className="text-red-400" />
  return <Info size={16} className="text-indigo-400" />
}

function NotifCard({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const typeColors: Record<string, string> = {
    success: 'border-l-emerald-500 bg-emerald-500/5',
    warning: 'border-l-yellow-500 bg-yellow-500/5',
    danger: 'border-l-red-500 bg-red-500/5',
    info: 'border-l-indigo-500 bg-indigo-500/5',
  }
  const color = typeColors[notif.type] || typeColors.info

  return (
    <div
      onClick={() => !notif.read && onRead(notif.id)}
      className={`glass-card p-4 flex items-start gap-4 border-l-2 transition-all duration-200
        ${color} ${!notif.read ? 'cursor-pointer hover:scale-[1.01]' : 'opacity-70'}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <NotificationIcon type={notif.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`text-sm font-semibold ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>
            {notif.title}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!notif.read && (
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDateRelative(notif.created_at)}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notif.message}</p>
      </div>
    </div>
  )
}

export default function Notifications() {
  const { notifications, isLoading, markAsRead, markAllRead, unreadCount } = useNotifications()

  const unread = notifications.filter(n => !n.read)
  const read = notifications.filter(n => n.read)

  return (
    <div className="space-y-6 animate-in max-w-2xl">
      <div className="page-header flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="page-title">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="page-subtitle">Stay updated on your financial activity</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            className="flex items-center gap-2 px-3 py-2 border border-border/60 rounded-lg text-xs hover:bg-accent/50 transition-colors"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : notifications.length === 0 ? (
        <div className="glass-card text-center py-16 text-muted-foreground">
          <Bell size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No notifications yet</p>
          <p className="text-sm mt-1">You'll receive alerts for budget overruns, bill reminders, and milestones</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Unread */}
          {unread.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Unread ({unread.length})
              </h2>
              <div className="space-y-2">
                {unread.map(n => (
                  <NotifCard key={n.id} notif={n} onRead={id => markAsRead.mutate(id)} />
                ))}
              </div>
            </div>
          )}

          {/* Read */}
          {read.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Earlier
              </h2>
              <div className="space-y-2">
                {read.map(n => (
                  <NotifCard key={n.id} notif={n} onRead={id => markAsRead.mutate(id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
