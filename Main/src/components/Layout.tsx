import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <header className="animate-fade-in" style={{
        padding: 'var(--s-md) 0 var(--s-sm)',
        textAlign: 'center',
        borderBottom: '1px solid var(--c-border-light)',
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'var(--f-display)',
            fontSize: '1.4rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'var(--c-text)',
          }}>
            <span style={{ color: 'var(--c-accent)' }}>Life</span> Purpose
          </h1>
          <p style={{
            marginTop: 2,
            fontSize: '0.78rem',
            color: 'var(--c-text-tertiary)',
            letterSpacing: '0.04em',
          }}>
            找到你真正想做的事
          </p>
        </div>
      </header>
      <main style={{ flex: 1, paddingBottom: '120px' }}>
        {children}
      </main>
    </div>
  )
}
