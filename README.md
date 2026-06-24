# 💰 Expense Tracker – Personal Finance Manager

A production-ready **Progressive Web Application (PWA)** for personal finance management. Built with React, TypeScript, Supabase, and Tailwind CSS.

![Expense Tracker](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)
![PWA](https://img.shields.io/badge/PWA-Ready-orange?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Income, expenses, balance, savings rate, budgets, bills |
| 💸 **Expense Tracking** | Add, edit, delete expenses with categories, payment methods |
| 💰 **Income Tracking** | Log income from multiple sources |
| 🎯 **Budget Manager** | Set monthly category budgets with progress bars |
| 🏆 **Savings Goals** | Create goals with progress tracking and target dates |
| 📱 **Subscriptions** | Track recurring payments and renewal dates |
| 🔔 **Bill Reminders** | Never miss a payment with overdue detection |
| 📈 **Analytics** | 12-month trends, category breakdowns, savings analysis |
| 🤖 **AI Insights** | Rule-based spending analysis and recommendations |
| 🔔 **Notifications** | Real-time alerts for budget exceeded, bills due |
| 🌙 **Dark/Light Mode** | Premium dark-mode-first design |
| 📲 **PWA** | Install as app, offline support, background sync |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS (custom design system)
- **State**: TanStack Query (React Query v5)
- **Routing**: React Router v6
- **Charts**: Recharts
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **PWA**: vite-plugin-pwa + Workbox

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- npm or yarn
- Supabase account ([Free at supabase.com](https://supabase.com))

---

### 1. Clone / Open Project

```bash
cd "C:\Users\suraj\Desktop\Expence"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Set a project name (e.g., `expense-tracker`) and strong password
3. Wait for the project to initialize (~2 minutes)
4. Go to **SQL Editor** → paste and run `supabase/schema.sql`
5. (Optional) Enable Realtime: SQL Editor → `ALTER PUBLICATION supabase_realtime ADD TABLE notifications;`

### 4. Configure Environment

Create a `.env.local` file in the project root:

```bash
# Copy from example
copy .env.example .env.local
```

Then open `.env.local` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Where to find these?**  
> Supabase Dashboard → **Settings** → **API** → copy `Project URL` and `anon public` key

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 📁 Project Structure

```
Expence/
├── public/
│   ├── manifest.json       # PWA manifest
│   └── favicon.svg
├── src/
│   ├── App.tsx              # Root with routing
│   ├── main.tsx
│   ├── index.css            # Global styles + design system
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client
│   │   └── utils.ts         # Helpers, formatters, constants
│   ├── types/
│   │   └── index.ts         # All TypeScript types
│   ├── contexts/
│   │   └── AuthContext.tsx  # Auth state + operations
│   ├── hooks/
│   │   ├── useDashboard.ts
│   │   ├── useExpenses.ts
│   │   ├── useIncome.ts
│   │   ├── useBudgets.ts
│   │   ├── useSavings.ts
│   │   ├── useSubscriptions.ts
│   │   ├── useBills.ts
│   │   └── useNotifications.ts
│   ├── components/
│   │   └── layout/
│   │       ├── AppLayout.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── MobileNav.tsx
│   └── pages/
│       ├── public/
│       │   ├── Landing.tsx
│       │   ├── Login.tsx
│       │   ├── Register.tsx
│       │   └── ForgotPassword.tsx
│       └── app/
│           ├── Dashboard.tsx
│           ├── Expenses.tsx
│           ├── Income.tsx
│           ├── Budgets.tsx
│           ├── SavingsGoals.tsx
│           ├── Subscriptions.tsx
│           ├── Bills.tsx
│           ├── Analytics.tsx
│           ├── AIInsights.tsx
│           ├── Notifications.tsx
│           ├── Profile.tsx
│           └── Settings.tsx
├── supabase/
│   └── schema.sql           # Complete DB schema + RLS
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🗄️ Database Schema

8 tables with Row Level Security:

| Table | Purpose |
|---|---|
| `profiles` | User profile info |
| `income` | Income entries |
| `expenses` | Expense entries |
| `budgets` | Monthly category budgets |
| `savings_goals` | Savings targets |
| `subscriptions` | Recurring payments |
| `bills` | Bill reminders |
| `notifications` | User notifications |

All tables have RLS enabled — users can **only** access their own data.

---

## 🔐 Security

- ✅ Supabase Row Level Security on all tables
- ✅ Protected routes (redirect if not authenticated)
- ✅ Environment variables for credentials
- ✅ Session persistence with auto token refresh
- ✅ Input validation on all forms

---

## 📲 PWA Installation

The app is installable on mobile and desktop:

1. Open the app in Chrome/Edge
2. Look for the **Install** prompt or go to browser menu → "Install App"
3. The app works offline with cached assets

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `dist/` folder.

---

## 🚀 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy** 🎉

---

## 🎨 Design System

- **Primary**: Indigo `#6366f1`
- **Secondary**: Violet `#8b5cf6`
- **Accent**: Cyan `#06b6d4`
- **Success**: Emerald `#10b981`
- **Warning**: Yellow `#f59e0b`
- **Danger**: Red `#ef4444`
- **Font**: Inter (body) + Plus Jakarta Sans (display)
- **Style**: Glassmorphism dark mode

---

## 📖 Pages

### Public
- `/` — Landing page with features and pricing
- `/login` — Email + password sign in
- `/register` — Create account
- `/forgot-password` — Password reset

### Protected (requires login)
- `/app/dashboard` — Overview dashboard
- `/app/expenses` — Expense tracking
- `/app/income` — Income tracking
- `/app/budgets` — Budget management
- `/app/savings` — Savings goals
- `/app/subscriptions` — Subscription tracker
- `/app/bills` — Bill reminders
- `/app/analytics` — Charts and trends
- `/app/insights` — AI-powered insights
- `/app/notifications` — Notification center
- `/app/profile` — User profile
- `/app/settings` — App settings

---

## 🎓 Academic Use

This project demonstrates:
- **React Hooks** (useState, useEffect, custom hooks)
- **TanStack Query** for server state management
- **Supabase** BaaS integration
- **Row Level Security** for data isolation
- **PWA** manifest + service worker
- **TypeScript** type safety
- **Recharts** data visualization
- **Responsive design** with Tailwind CSS

---

## 📝 License

MIT License – free for personal and educational use.

---

Made with ❤️ for final-year engineering projects and portfolio showcase.
