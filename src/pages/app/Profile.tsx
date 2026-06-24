import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, Mail, Calendar, Loader2, CheckCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function Profile() {
  const { profile, updateProfile, user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await updateProfile({ full_name: fullName })
    setLoading(false)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="space-y-6 animate-in max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      {/* Avatar card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">{profile?.full_name}</h2>
            <p className="text-muted-foreground text-sm">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <CheckCircle size={10} /> Verified
              </span>
              <span className="text-xs text-muted-foreground">
                Member since {profile?.created_at ? formatDate(profile.created_at) : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold">Personal Information</h3>
          {!editing && (
            <button onClick={() => { setEditing(true); setFullName(profile?.full_name || '') }}
              className="text-xs text-primary hover:text-primary/80 px-3 py-1.5 border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
              Edit Profile
            </button>
          )}
        </div>

        {saved && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
            <CheckCircle size={16} /> Profile updated successfully!
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Full Name</label>
            {editing ? (
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-colors" />
              </div>
            ) : (
              <div className="flex items-center gap-2 py-2.5 px-3 bg-secondary/30 rounded-lg text-sm">
                <User size={15} className="text-muted-foreground" />
                {profile?.full_name || '—'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="flex items-center gap-2 py-2.5 px-3 bg-secondary/30 rounded-lg text-sm text-muted-foreground">
              <Mail size={15} />
              {profile?.email || user?.email || '—'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here. Contact support.</p>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Member Since</label>
            <div className="flex items-center gap-2 py-2.5 px-3 bg-secondary/30 rounded-lg text-sm text-muted-foreground">
              <Calendar size={15} />
              {profile?.created_at ? formatDate(profile.created_at) : '—'}
            </div>
          </div>
        </div>

        {editing && (
          <div className="flex gap-3 mt-5">
            <button onClick={() => setEditing(false)} className="flex-1 py-2.5 border border-border/60 rounded-lg text-sm hover:bg-accent/50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Account info */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">Account Security</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-border/30">
            <div>
              <div className="text-sm font-medium">Password</div>
              <div className="text-xs text-muted-foreground">Last changed: Unknown</div>
            </div>
            <button className="text-xs text-primary hover:text-primary/80 px-3 py-1.5 border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-medium">Two-Factor Authentication</div>
              <div className="text-xs text-muted-foreground">Add extra security to your account</div>
            </div>
            <span className="text-xs text-muted-foreground">Coming soon</span>
          </div>
        </div>
      </div>
    </div>
  )
}
