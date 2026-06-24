import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

// Layouts
import AppLayout from '@/components/layout/AppLayout'

// Public pages
import Landing from '@/pages/public/Landing'
import Login from '@/pages/public/Login'
import Register from '@/pages/public/Register'
import ForgotPassword from '@/pages/public/ForgotPassword'

// App pages
import Dashboard from '@/pages/app/Dashboard'
import Expenses from '@/pages/app/Expenses'
import Income from '@/pages/app/Income'
import Budgets from '@/pages/app/Budgets'
import SavingsGoals from '@/pages/app/SavingsGoals'
import Subscriptions from '@/pages/app/Subscriptions'
import Bills from '@/pages/app/Bills'
import Analytics from '@/pages/app/Analytics'
import AIInsights from '@/pages/app/AIInsights'
import Notifications from '@/pages/app/Notifications'
import Profile from '@/pages/app/Profile'
import Settings from '@/pages/app/Settings'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/app/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected App */}
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="income" element={<Income />} />
              <Route path="budgets" element={<Budgets />} />
              <Route path="savings" element={<SavingsGoals />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="bills" element={<Bills />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="insights" element={<AIInsights />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(222, 47%, 10%)',
              color: 'hsl(210, 40%, 98%)',
              border: '1px solid hsl(222, 47%, 16%)',
              borderRadius: '12px',
              fontSize: '14px'
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}
