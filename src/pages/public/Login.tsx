import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(
        error.message === '{}'
          ? 'Failed to connect to Supabase. Please check your internet connection or Supabase settings.'
          : error.message || 'Invalid credentials. Please try again.'
      )
    } else {
      navigate('/app/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-primary items-center justify-center text-primary-foreground text-2xl font-bold mb-4 shadow-lg shadow-primary/20">
            ₹
          </div>
          <h1 className="text-2xl font-display font-bold">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your Expense Tracker account</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            💡 Create a free account to get started with demo data
          </p>
        </div>
        
        {/* Custom Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground font-medium tracking-wide">
            Developed by Suraj Neralla
          </p>
        </div>
      </div>
    </div>
  )
}
