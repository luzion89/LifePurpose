import type { ReactNode } from 'react'
import type { AppLanguage } from '../i18n'
import { UI_TEXT } from '../i18n'

interface LayoutProps {
  children: ReactNode
  language: AppLanguage
  onLanguageChange: (language: AppLanguage) => void
}

export function Layout({ children, language, onLanguageChange }: LayoutProps) {
  const copy = UI_TEXT[language]

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
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'start',
          gap: 'var(--s-md)',
        }}>
          <div style={{ textAlign: 'left' }}>
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
              {copy.layout.subtitle}
            </p>
          </div>

          <div style={{
            justifySelf: 'end',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 'var(--s-xs)',
          }}>
            <span style={{
              fontSize: '0.68rem',
              color: 'var(--c-text-tertiary)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              {copy.layout.language}
            </span>
            <div style={{
              display: 'inline-flex',
              padding: 3,
              borderRadius: 'var(--r-pill)',
              background: 'var(--c-bg-hover)',
              border: '1px solid var(--c-border)',
            }}>
              {(['zh', 'en'] as const).map(code => {
                const active = language === code
                return (
                  <button
                    key={code}
                    onClick={() => onLanguageChange(code)}
                    aria-pressed={active}
                    style={{
                      padding: '6px 10px',
                      minWidth: 44,
                      borderRadius: 'var(--r-pill)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: active ? '#fff' : 'var(--c-text-secondary)',
                      background: active ? 'var(--c-accent)' : 'transparent',
                      transition: 'all var(--t-fast) var(--ease-out)',
                    }}
                  >
                    {code === 'zh' ? '中文' : 'EN'}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </header>
      <main style={{ flex: 1, paddingBottom: '120px' }}>
        {children}
      </main>
    </div>
  )
}
