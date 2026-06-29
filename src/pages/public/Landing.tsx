import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Landing() {
  const { session } = useAuth()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll('.glass-card')
      cards.forEach(card => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        ;(card as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
        ;(card as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground select-none relative overflow-x-hidden font-body-md">
      {/* TopAppBar */}
      <header className="bg-card/70 dark:bg-card/70 backdrop-blur-xl docked full-width top-0 sticky border-b border-border shadow-md z-50">
        <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1200px] mx-auto py-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
            <span className="font-headline-lg text-headline-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Expence Tracker</span>
          </div>
          <nav className="flex gap-4 md:gap-8 items-center">
            <a className="text-primary font-bold font-label-md text-label-md hover:bg-accent transition-colors px-2 py-1 rounded" href="#">Home</a>
            <a className="text-muted-foreground font-label-md text-label-md hover:bg-accent transition-colors px-2 py-1 rounded" href="#features">Features</a>
            <a className="text-muted-foreground font-label-md text-label-md hover:bg-accent transition-colors px-2 py-1 rounded" href="#pricing">Pricing</a>
            {session ? (
              <Link to="/app/dashboard" className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg shadow-lg shadow-primary/20 transition-all duration-300">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="bg-accent border border-border text-foreground font-bold px-4 py-2 rounded-lg hover:bg-accent/80 transition-colors">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Hero Section */}
        <section className="relative min-h-[750px] flex items-center pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            <div className="flex flex-col justify-center gap-6 md:gap-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent border border-border rounded-full w-fit">
                <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="font-label-md text-label-md text-tertiary">New AI Insights v2.4</span>
              </div>
              <h1 className="font-display-lg text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
                Take Control of Your <span className="text-primary">Wealth</span>
              </h1>
              <p className="text-muted-foreground font-normal text-lg md:text-xl max-w-lg leading-relaxed">
                Experience the next generation of personal finance. Our AI-driven insights analyze your spending patterns to help you save more, invest smarter, and reach your goals faster.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-4 md:pt-6">
                <Link to="/register" className="bg-primary text-primary-foreground font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-primary/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                  Get Started Free
                </Link>
                <a href="#features" className="bg-accent border border-border text-muted-foreground hover:text-foreground hover:bg-accent/80 hover:border-border font-medium px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch Demo
                </a>
              </div>
            </div>
            
            <div className="relative flex justify-center items-center">
              {/* App Mockup Shell */}
              <div className="animate-float glass-card p-4 rounded-[2rem] beveled-edge w-full max-w-sm aspect-[9/19] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                <div className="relative h-full w-full bg-background rounded-[1.5rem] overflow-hidden border border-border flex flex-col p-4">
                  <div className="flex justify-between items-center pt-1 pb-4">
                    <span className="text-[10px] font-bold">9:41</span>
                    <div className="flex gap-1">
                      <span className="material-symbols-outlined text-[10px]">signal_cellular_4_bar</span>
                      <span className="material-symbols-outlined text-[10px]">wifi</span>
                      <span className="material-symbols-outlined text-[10px]">battery_full</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-1 flex flex-col justify-start">
                    <div className="h-28 w-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-4 flex flex-col justify-end border border-border">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Balance</span>
                      <span className="text-xl font-bold text-foreground mt-1">$12,450.80</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-12 w-full bg-accent rounded-lg flex items-center justify-between px-3 border border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-xs text-primary">shopping_cart</span>
                          </div>
                          <span className="text-[11px] text-foreground">Amazon</span>
                        </div>
                        <span className="text-[11px] font-bold text-error">-$84.50</span>
                      </div>
                      
                      <div className="h-12 w-full bg-accent rounded-lg flex items-center justify-between px-3 border border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-tertiary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-xs text-tertiary">restaurant</span>
                          </div>
                          <span className="text-[11px] text-foreground">Whole Foods</span>
                        </div>
                        <span className="text-[11px] font-bold text-error">-$120.00</span>
                      </div>
                    </div>
                    
                    <div className="h-24 w-full bg-accent rounded-xl border border-border overflow-hidden p-2">
                      <div className="w-full h-full bg-cover bg-center rounded-lg" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuABkLxn_c4601wbvwMVUUG0t4ks1zOK7jlRL6txMzebV1v_thzHOVuoDjbyv1dwuz9nAhNgJCEHht48rKvAXih2UJhYXnnKjrshIaOVm7Mh3jFnOqnsuGDOkk7QBLXd1XUYKU2vwDWG5UV4PnSaYmo3qpnrm-3IRgRoFX3E1w7LrElMqolmA22IYU6wRwuCTjeg_XwZrMKZ5Vdz4ijDUdEmRULXYoEmK0SW8YRkuiAY1KgeK0tcceKXShhIQRfPP5PlET1fwd6rnqxD')" }}></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative blur */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] -z-10 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-border my-16 bg-accent/20 rounded-3xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="font-stat-xl text-3xl md:text-4xl text-foreground font-extrabold">$142M+</h3>
              <p className="font-label-md text-xs text-muted-foreground uppercase tracking-widest">Money Saved</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-stat-xl text-3xl md:text-4xl text-foreground font-extrabold">2.5M</h3>
              <p className="font-label-md text-xs text-muted-foreground uppercase tracking-widest">Active Users</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-stat-xl text-3xl md:text-4xl text-foreground font-extrabold">4.9/5</h3>
              <p className="font-label-md text-xs text-muted-foreground uppercase tracking-widest">App Rating</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-stat-xl text-3xl md:text-4xl text-foreground font-extrabold">100+</h3>
              <p className="font-label-md text-xs text-muted-foreground uppercase tracking-widest">Bank Links</p>
            </div>
          </div>
        </section>

        {/* Feature Grid (Bento Style) */}
        <section className="py-20 md:py-24" id="features">
          <div className="mb-12 text-center md:text-left">
            <h2 className="font-headline-lg text-3xl text-foreground font-bold mb-2">Professional Tools for Your Money</h2>
            <p className="text-muted-foreground font-body-md text-body-md">Smarter tracking, better saving, more living.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Expense Tracking */}
            <div className="md:col-span-3 glass-card p-8 flex flex-col justify-between overflow-hidden relative group transition-all duration-300 hover:scale-[1.01] hover:border-primary/30 min-h-[250px]">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-primary text-4xl mb-4">dashboard</span>
                <h4 className="font-headline-lg text-xl text-foreground font-bold mb-2">Expense Tracking</h4>
                <p className="text-muted-foreground text-sm">Real-time categorization of every transaction across all your connected accounts.</p>
              </div>
            </div>
            {/* AI Insights */}
            <div className="md:col-span-3 glass-card p-8 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-surface-container to-primary/10 transition-all duration-300 hover:scale-[1.01] hover:border-tertiary/30 min-h-[250px]">
              <div>
                <span className="material-symbols-outlined text-tertiary text-4xl mb-4">auto_awesome</span>
                <h4 className="font-headline-lg text-xl text-foreground font-bold mb-2">AI Insights</h4>
                <p className="text-muted-foreground text-sm">Predictive analysis that warns you of potential overspending before it happens.</p>
              </div>
              <div className="mt-4 p-4 bg-accent rounded-xl border border-border">
                <p className="text-xs text-tertiary italic">"You're on track to save an extra $450 this month if you maintain your current coffee spending."</p>
              </div>
            </div>
            {/* Budgeting */}
            <div className="md:col-span-2 glass-card p-6 flex flex-col justify-center gap-4 transition-all duration-300 hover:scale-[1.01] hover:border-secondary/30 min-h-[180px]">
              <span className="material-symbols-outlined text-secondary text-4xl">payments</span>
              <h4 className="font-headline-lg text-lg text-foreground font-bold">Smart Budgeting</h4>
              <p className="text-muted-foreground text-xs">Flexible budgets that adapt to your lifestyle changes.</p>
            </div>
            {/* Bills */}
            <div className="md:col-span-2 glass-card p-6 flex flex-col justify-center gap-4 transition-all duration-300 hover:scale-[1.01] hover:border-error/30 min-h-[180px]">
              <span className="material-symbols-outlined text-error text-4xl">receipt_long</span>
              <h4 className="font-headline-lg text-lg text-foreground font-bold">Bill Reminders</h4>
              <p className="text-muted-foreground text-xs">Never miss a payment with automated alerts and scheduling.</p>
            </div>
            {/* Goals */}
            <div className="md:col-span-2 glass-card p-6 flex flex-col justify-center gap-4 transition-all duration-300 hover:scale-[1.01] hover:border-primary-container/30 min-h-[180px]">
              <span className="material-symbols-outlined text-primary-container text-4xl">savings</span>
              <h4 className="font-headline-lg text-lg text-foreground font-bold">Savings Goals</h4>
              <p className="text-muted-foreground text-xs">Track progress toward your house, car, or dream vacation.</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 md:py-24" id="pricing">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">Secure your financial future with plans that fit your size.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-6 flex flex-col justify-between border border-border relative min-h-[350px]">
              <div>
                <div className="text-lg font-bold text-foreground mb-2">Free</div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-primary">$0</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">✓ Basic expense tracking</li>
                  <li className="flex items-center gap-2">✓ 3 savings goals</li>
                  <li className="flex items-center gap-2">✓ Monthly email reports</li>
                </ul>
              </div>
              <Link to="/register" className="block text-center py-2.5 rounded-lg font-medium text-sm border border-border hover:bg-accent transition-colors text-foreground">
                Get Started
              </Link>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between border border-primary/30 ring-1 ring-primary/20 relative min-h-[350px]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-on-primary-container text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div>
                <div className="text-lg font-bold text-foreground mb-2">Pro</div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-primary">$5</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2 text-primary">✓ Unlimited transactions</li>
                  <li className="flex items-center gap-2 text-primary">✓ All analytics & AI insights</li>
                  <li className="flex items-center gap-2 text-primary">✓ Unlimited goals & bill alerts</li>
                  <li className="flex items-center gap-2 text-primary">✓ CSV / Excel export</li>
                </ul>
              </div>
              <Link to="/register" className="block text-center py-2.5 rounded-lg font-medium text-sm bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all duration-300">
                Start Free Trial
              </Link>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between border border-border relative min-h-[350px]">
              <div>
                <div className="text-lg font-bold text-foreground mb-2">Enterprise</div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-primary">Custom</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">✓ Everything in Pro</li>
                  <li className="flex items-center gap-2">✓ Multi-user / Shared budgets</li>
                  <li className="flex items-center gap-2">✓ Priority 24/7 support</li>
                  <li className="flex items-center gap-2">✓ API access & integrations</li>
                </ul>
              </div>
              <Link to="/register" className="block text-center py-2.5 rounded-lg font-medium text-sm border border-border hover:bg-accent transition-colors text-foreground">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 px-4">
          <div className="max-w-[1000px] mx-auto glass-card rounded-[2.5rem] p-12 text-center relative overflow-hidden beveled-edge">
            <div className="relative z-10">
              <h2 className="font-display-lg text-3xl md:text-4xl text-foreground font-bold mb-4">Ready to master your money?</h2>
              <p className="text-muted-foreground font-body-md text-body-md max-w-xl mx-auto mb-8">
                Join millions of users who trust Expence Tracker to secure their financial future. Start your 30-day free trial today.
              </p>
              <Link to="/register" className="inline-block bg-primary text-primary-foreground font-bold px-10 py-4 rounded-full shadow-xl shadow-primary/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                Create Your Free Account
              </Link>
              <p className="text-xs text-muted-foreground mt-4">No credit card required. Cancel anytime.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card pt-20 pb-12 border-t border-border mt-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>account_balance_wallet</span>
                <span className="font-headline-lg text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Expence Tracker</span>
              </div>
              <p className="text-muted-foreground text-sm">The world's most advanced AI-powered personal finance management tool.</p>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-label-md text-xs text-foreground uppercase tracking-widest">Product</h5>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a className="hover:text-primary transition-colors" href="#features">Features</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Security</a></li>
                <li><a className="hover:text-primary transition-colors" href="#pricing">Pricing</a></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-label-md text-xs text-foreground uppercase tracking-widest">Company</h5>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a className="hover:text-primary transition-colors" href="#">About</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-label-md text-xs text-foreground uppercase tracking-widest">Legal</h5>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border gap-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Expence Tracker Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="text-muted-foreground hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined text-sm">public</span></a>
              <a className="text-muted-foreground hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined text-sm">alternate_email</span></a>
              <a className="text-muted-foreground hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined text-sm">share</span></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
