/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // custom finance colors
        income: '#10b981',
        expense: '#ef4444',
        saving: '#6366f1',
        warning: '#f59e0b',
        'brand-purple': '#8b5cf6',
        'brand-cyan': '#06b6d4',
        
        // M3 Design System tokens
        "secondary-fixed-dim": "#d0bcff",
        "surface-container-highest": "#323537",
        "on-error-container": "#ffdad6",
        "primary-fixed": "#d8e2ff",
        "surface-container-lowest": "#0b0f10",
        "on-tertiary-fixed-variant": "#005321",
        "error-container": "#93000a",
        "on-tertiary-fixed": "#002109",
        "surface-container": "#1d2022",
        "on-surface": "#e0e3e5",
        "on-primary-container": "#00285d",
        "on-secondary": "#3c0091",
        "primary-fixed-dim": "#adc6ff",
        "surface": "#101415",
        "tertiary": "#4ae176",
        "on-primary": "#002e6a",
        "secondary-container": "#571bc1",
        "inverse-on-surface": "#2d3133",
        "error": "#ffb4ab",
        "outline": "#8c909f",
        "on-error": "#690005",
        "on-surface-variant": "#c2c6d6",
        "secondary-m3": "#d0bcff",
        "secondary-fixed": "#e9ddff",
        "tertiary-fixed-dim": "#4ae176",
        "on-background": "#e0e3e5",
        "outline-variant": "#424754",
        "tertiary-fixed": "#6bff8f",
        "surface-container-low": "#191c1e",
        "surface-bright": "#363a3b",
        "on-primary-fixed": "#001a42",
        "on-primary-fixed-variant": "#004395",
        "surface-variant": "#323537",
        "surface-tint": "#adc6ff",
        "surface-container-high": "#272a2c",
        "inverse-surface": "#e0e3e5",
        "on-secondary-fixed": "#23005c",
        "on-tertiary-container": "#003111",
        "on-secondary-container": "#c4abff",
        "on-secondary-fixed-variant": "#5516be",
        "on-tertiary": "#003915",
        "inverse-primary": "#005ac2",
        "surface-dim": "#101415",
        "tertiary-container": "#00a74b"
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        DEFAULT: '0.25rem',
        xl: '0.75rem',
        full: '9999px'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        "stat-xl": ["Geist"],
        "body-sm": ["Inter"],
        "headline-lg-mobile": ["Geist"],
        "headline-lg": ["Geist"],
        "body-md": ["Inter"],
        "label-md": ["Geist"],
        "display-lg": ["Geist"]
      },
      fontSize: {
        "stat-xl": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "body-sm": ["14px", {"lineHeight": "20px", "letterSpacing": "0em", "fontWeight": "400"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
        "body-md": ["16px", {"lineHeight": "24px", "letterSpacing": "0em", "fontWeight": "400"}],
        "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.04em", "fontWeight": "700"}]
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' }
        },
        'count-up': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(99,102,241,0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(99,102,241,0.8)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        shimmer: 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite'
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
