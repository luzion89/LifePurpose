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
        padding: 'var(--s-xl) 0 var(--s-lg)',
        textAlign: 'center',
        borderBottom: '1px solid var(--c-border-light)',
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'var(--f-display)',
            fontSize: '1.6rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'var(--c-text)',
          }}>
            <span style={{ color: 'var(--c-accent)' }}>Life</span> Purpose
          </h1>
          <p style={{
            marginTop: 'var(--s-xs)',
            fontSize: '0.85rem',
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
