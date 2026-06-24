import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, CheckCircle } from 'lucide-react'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    setLoading(false)
    if (error) {
      const isDbError = error.message === '{}' || error.message?.includes('Database error')
      setError(
        isDbError
          ? 'Database trigger error saving new user. Please make sure you have run the updated trigger function in your Supabase SQL Editor.'
          : error.message || 'Registration failed. Please try again.'
      )
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/app/dashboard'), 2000)
    }
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center glass-card p-10 max-w-md w-full">
        <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Account Created!</h2>
        <p className="text-muted-foreground text-sm">Redirecting to your dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-indigo-500/30">₹</div>
          <h1 className="text-2xl font-display font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Start tracking your finances for free</p>
        </div>
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Suraj Kumar"
                  className="w-full pl-9 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 6 characters"
                  className="w-full pl-9 pr-10 py-3 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-all hover:scale-[1.01] disabled:opacity-50 shadow-lg shadow-indigo-500/20">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
