import { useState, useMemo, type CSSProperties } from 'react'
import type { ImportantItem, SkilledItem, LikedItem } from '../data/lists'

type ListType = 'important' | 'skilled' | 'liked'
type AnyItem = ImportantItem | SkilledItem | LikedItem

interface ChecklistPageProps {
  type: ListType
  items: AnyItem[]
  selectedIds: Set<number>
  onToggle: (id: number) => void
  onNext: () => void
  onPrev?: () => void
  stepLabel: string
  stepDescription: string
}

const DESCRIPTIONS: Record<ListType, string> = {
  important: '选出对你而言"重要的价值观"——它们定义了你认为人生中最重要的是什么。',
  skilled: '选出你"擅长的才能"——那些你天生就做得好、做起来不费力的事。',
  liked: '选出你"感兴趣的领域"——那些能让你发自内心感到快乐的方向。',
}

export function ChecklistPage({
  type, items, selectedIds, onToggle, onNext, onPrev, stepLabel, stepDescription,
}: ChecklistPageProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = search.trim().toLowerCase()
    return items.filter(item => {
      if ('keyword' in item) return item.keyword.includes(q) || item.desc.includes(q)
      if ('talent' in item) return item.talent.includes(q) || item.strength.includes(q)
      if ('name' in item) return item.name.includes(q)
      return false
    })
  }, [items, search])

  const isLiked = type === 'liked'

  return (
    <div className="container" style={{ paddingTop: 'var(--s-md)', paddingBottom: 100 }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 'var(--s-md)' }}>
        <h2 style={{
          fontFamily: 'var(--f-display)',
          color: 'var(--c-text)',
          fontSize: '1.3rem',
          marginBottom: 2,
        }}>
          {stepLabel}
        </h2>
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--c-text-secondary)',
          lineHeight: 1.5,
        }}>
          {stepDescription || DESCRIPTIONS[type]}
        </p>
      </div>

      {/* Search — sticky */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--c-bg)',
        paddingTop: 'var(--s-xs)',
        paddingBottom: 'var(--s-sm)',
        marginBottom: 'var(--s-sm)',
      }}>
        <input
          type="text"
          placeholder="搜索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '8px var(--s-md)',
            border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-md)',
            background: 'var(--c-bg-elevated)',
            fontFamily: 'var(--f-body)',
            fontSize: '0.85rem',
            color: 'var(--c-text)',
            outline: 'none',
            transition: 'border-color var(--t-fast)',
            boxSizing: 'border-box',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--c-accent)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
        />
      </div>

      {/* Items */}
      {isLiked ? (
        <LikedGrid
          items={filtered as LikedItem[]}
          selectedIds={selectedIds}
          onToggle={onToggle}
        />
      ) : type === 'important' ? (
        <ImportantList
          items={filtered as ImportantItem[]}
          selectedIds={selectedIds}
          onToggle={onToggle}
        />
      ) : (
        <SkilledList
          items={filtered as SkilledItem[]}
          selectedIds={selectedIds}
          onToggle={onToggle}
        />
      )}

      {/* Bottom bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--c-bg-elevated)',
        borderTop: '1px solid var(--c-border-light)',
        padding: 'var(--s-md) var(--s-lg)',
        animation: 'slideUp var(--t-normal) var(--ease-out)',
        zIndex: 100,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          maxWidth: 680,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-md)' }}>
            {onPrev && (
              <button
                onClick={onPrev}
                style={navBtnStyle('secondary')}
              >
                上一步
              </button>
            )}
            <span style={{
              fontSize: '0.85rem',
              color: 'var(--c-text-secondary)',
            }}>
              已选 <strong style={{ color: 'var(--c-accent)' }}>{selectedIds.size}</strong> 项
            </span>
          </div>
          <button
            onClick={onNext}
            style={navBtnStyle('primary')}
          >
            下一步 →
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===== Sub-components ===== */

function ImportantList({ items, selectedIds, onToggle }: {
  items: ImportantItem[]; selectedIds: Set<number>; onToggle: (id: number) => void
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--s-xs)',
    }}>
      {items.map((item, index) => {
        const selected = selectedIds.has(item.id)
        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className="animate-fade-in-up"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '10px 12px',
              borderRadius: 'var(--r-md)',
              border: selected
                ? '1.5px solid var(--c-accent)'
                : '1.5px solid var(--c-border-light)',
              background: selected ? 'var(--c-accent-soft)' : 'var(--c-bg-elevated)',
              cursor: 'pointer',
              transition: 'all var(--t-fast) var(--ease-out)',
              textAlign: 'left',
              animationDelay: `${Math.min(index * 15, 300)}ms`,
            }}
          >
            <div style={{ ...checkboxStyle(selected), marginTop: 2 }}>
              {selected && <span style={{ fontSize: '0.65rem' }}>✓</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--f-display)',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: selected ? 'var(--c-accent)' : 'var(--c-text)',
                transition: 'color var(--t-fast)',
              }}>
                {item.keyword}
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--c-text-tertiary)',
                marginTop: 1,
                lineHeight: 1.4,
              }}>
                {item.desc}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function SkilledList({ items, selectedIds, onToggle }: {
  items: SkilledItem[]; selectedIds: Set<number>; onToggle: (id: number) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, index) => {
        const selected = selectedIds.has(item.id)
        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className="animate-fade-in-up"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 'var(--r-md)',
              border: selected
                ? '1.5px solid var(--c-accent)'
                : '1.5px solid var(--c-border-light)',
              background: selected ? 'var(--c-accent-soft)' : 'var(--c-bg-elevated)',
              cursor: 'pointer',
              transition: 'all var(--t-fast) var(--ease-out)',
              textAlign: 'left',
              animationDelay: `${Math.min(index * 15, 300)}ms`,
            }}
          >
            <div style={{ ...checkboxStyle(selected), marginTop: 3, flexShrink: 0 }}>
              {selected && <span style={{ fontSize: '0.65rem' }}>✓</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* 才能 — 标题 */}
              <div style={{
                fontFamily: 'var(--f-display)',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: selected ? 'var(--c-accent)' : 'var(--c-text)',
                transition: 'color var(--t-fast)',
                marginBottom: 4,
              }}>
                {item.talent}
              </div>
              {/* 长处 */}
              <div style={{
                fontSize: '0.75rem',
                color: '#5a8a5a',
                lineHeight: 1.4,
                display: 'flex',
                gap: 4,
              }}>
                <span style={{ flexShrink: 0, opacity: 0.7 }}>↑</span>
                <span>{item.strength}</span>
              </div>
              {/* 短处 */}
              <div style={{
                fontSize: '0.75rem',
                color: '#9a6a3a',
                lineHeight: 1.4,
                marginTop: 2,
                display: 'flex',
                gap: 4,
              }}>
                <span style={{ flexShrink: 0, opacity: 0.7 }}>↓</span>
                <span>{item.weakness}</span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function LikedGrid({ items, selectedIds, onToggle }: {
  items: LikedItem[]; selectedIds: Set<number>; onToggle: (id: number) => void
}) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--s-sm)',
    }}>
      {items.map((item, index) => {
        const selected = selectedIds.has(item.id)
        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className="animate-fade-in-up"
            style={{
              padding: 'var(--s-sm) var(--s-md)',
              borderRadius: 'var(--r-pill)',
              border: selected
                ? '1.5px solid var(--c-accent)'
                : '1.5px solid var(--c-border)',
              background: selected ? 'var(--c-accent-soft)' : 'var(--c-bg-elevated)',
              color: selected ? 'var(--c-accent-hover)' : 'var(--c-text-secondary)',
              fontFamily: 'var(--f-body)',
              fontSize: '0.85rem',
              fontWeight: selected ? 600 : 400,
              cursor: 'pointer',
              transition: 'all var(--t-fast) var(--ease-out)',
              animationDelay: `${Math.min(index * 15, 400)}ms`,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              if (!selected) {
                e.currentTarget.style.borderColor = 'var(--c-accent)'
                e.currentTarget.style.color = 'var(--c-accent)'
              }
            }}
            onMouseLeave={e => {
              if (!selected) {
                e.currentTarget.style.borderColor = 'var(--c-border)'
                e.currentTarget.style.color = 'var(--c-text-secondary)'
              }
            }}
          >
            {item.name}
          </button>
        )
      })}
    </div>
  )
}

/* ===== Style helpers ===== */

function checkboxStyle(checked: boolean): CSSProperties {
  return {
    width: 20,
    height: 20,
    borderRadius: 'var(--r-sm)',
    border: checked ? '2px solid var(--c-accent)' : '2px solid var(--c-border)',
    background: checked ? 'var(--c-accent)' : 'transparent',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all var(--t-fast) var(--ease-spring)',
    animation: checked ? 'checkPop var(--t-normal) var(--ease-spring)' : 'none',
  }
}

function navBtnStyle(variant: 'primary' | 'secondary'): CSSProperties {
  if (variant === 'primary') {
    return {
      padding: 'var(--s-sm) var(--s-lg)',
      background: 'var(--c-accent)',
      color: '#fff',
      borderRadius: 'var(--r-pill)',
      fontWeight: 600,
      fontSize: '0.85rem',
      letterSpacing: '0.02em',
      transition: 'background var(--t-fast)',
      border: 'none',
      cursor: 'pointer',
    }
  }
  return {
    padding: 'var(--s-sm) var(--s-md)',
    background: 'transparent',
    color: 'var(--c-text-secondary)',
    borderRadius: 'var(--r-pill)',
    fontWeight: 500,
    fontSize: '0.85rem',
    border: '1px solid var(--c-border)',
    cursor: 'pointer',
    transition: 'all var(--t-fast)',
  }
}

