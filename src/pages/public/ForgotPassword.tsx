import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 items-center justify-center text-white text-2xl font-bold mb-4">₹</div>
          <h1 className="text-2xl font-display font-bold">Reset Password</h1>
          <p className="text-muted-foreground text-sm mt-1">We'll send you a reset link</p>
        </div>
        <div className="glass-card p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle size={40} className="text-emerald-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Sent!</h3>
              <p className="text-sm text-muted-foreground mb-6">Check your inbox for the password reset link.</p>
              <Link to="/login" className="text-primary hover:text-primary/80 text-sm font-medium">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>}
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50">
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          )}
          {!sent && (
            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
