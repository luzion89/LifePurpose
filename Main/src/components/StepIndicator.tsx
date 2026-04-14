import { type CSSProperties } from 'react'

interface StepIndicatorProps {
  currentStep: number  // 0, 1, 2, 3 (3 = result)
  onStepClick: (step: number) => void
  counts: [number, number, number]  // selected counts for each list
}

const STEPS = [
  { label: '重要的事', sub: '价值观' },
  { label: '擅长的事', sub: '才能' },
  { label: '喜欢的事', sub: '热情' },
]

export function StepIndicator({ currentStep, onStepClick, counts }: StepIndicatorProps) {
  return (
    <div className="animate-fade-in-up stagger-1" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0,
      padding: 'var(--s-lg) 0',
    }}>
      {STEPS.map((step, i) => {
        const isActive = currentStep === i
        const isDone = currentStep > i || currentStep === 3
        const isClickable = true

        const dotStyle: CSSProperties = {
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 600,
          transition: 'all var(--t-normal) var(--ease-out)',
          border: isActive
            ? '2px solid var(--c-accent)'
            : isDone
              ? '2px solid var(--c-accent)'
              : '2px solid var(--c-border)',
          background: isDone && !isActive ? 'var(--c-accent)' : 'transparent',
          color: isDone && !isActive
            ? '#fff'
            : isActive
              ? 'var(--c-accent)'
              : 'var(--c-text-tertiary)',
        }

        const labelStyle: CSSProperties = {
          fontSize: '0.78rem',
          fontWeight: isActive ? 600 : 400,
          color: isActive ? 'var(--c-text)' : isDone ? 'var(--c-accent)' : 'var(--c-text-tertiary)',
          transition: 'all var(--t-normal) var(--ease-out)',
          fontFamily: 'var(--f-display)',
          letterSpacing: '0.03em',
        }

        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => isClickable && onStepClick(i)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--s-xs)',
                padding: 'var(--s-sm) var(--s-md)',
                cursor: isClickable ? 'pointer' : 'default',
                borderRadius: 'var(--r-md)',
                transition: 'background var(--t-fast)',
              }}
              onMouseEnter={e => {
                if (isClickable) e.currentTarget.style.background = 'var(--c-bg-hover)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
              }}
              aria-label={`步骤 ${i + 1}: ${step.label}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <div style={dotStyle}>
                {isDone && !isActive ? '✓' : i + 1}
              </div>
              <span style={labelStyle}>{step.label}</span>
              {counts[i] > 0 && (
                <span style={{
                  fontSize: '0.65rem',
                  color: 'var(--c-accent)',
                  fontFamily: 'var(--f-body)',
                }}>
                  已选 {counts[i]}
                </span>
              )}
            </button>
            {i < STEPS.length - 1 && (
              <div style={{
                width: 32,
                height: 1,
                background: isDone ? 'var(--c-accent)' : 'var(--c-border)',
                transition: 'background var(--t-normal)',
                flexShrink: 0,
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
