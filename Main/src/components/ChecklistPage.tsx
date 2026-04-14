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
  const [expandedId, setExpandedId] = useState<number | null>(null)

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
    <div className="container" style={{ paddingTop: 'var(--s-lg)' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 'var(--s-lg)' }}>
        <h2 style={{
          fontFamily: 'var(--f-display)',
          color: 'var(--c-text)',
          marginBottom: 'var(--s-xs)',
        }}>
          {stepLabel}
        </h2>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--c-text-secondary)',
          lineHeight: 1.6,
        }}>
          {stepDescription || DESCRIPTIONS[type]}
        </p>
      </div>

      {/* Search */}
      <div className="animate-fade-in-up stagger-1" style={{ marginBottom: 'var(--s-lg)' }}>
        <input
          type="text"
          placeholder="搜索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--s-sm) var(--s-md)',
            border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-md)',
            background: 'var(--c-bg-elevated)',
            fontFamily: 'var(--f-body)',
            fontSize: '0.9rem',
            color: 'var(--c-text)',
            outline: 'none',
            transition: 'border-color var(--t-fast)',
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
          expandedId={expandedId}
          onExpand={setExpandedId}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-sm)' }}>
      {items.map((item, index) => {
        const selected = selectedIds.has(item.id)
        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className="animate-fade-in-up"
            style={{
              ...cardStyle(selected),
              animationDelay: `${Math.min(index * 20, 300)}ms`,
            }}
          >
            <div style={checkboxStyle(selected)}>
              {selected && <span style={{ fontSize: '0.7rem' }}>✓</span>}
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <span style={{
                fontFamily: 'var(--f-display)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: selected ? 'var(--c-accent)' : 'var(--c-text)',
                transition: 'color var(--t-fast)',
              }}>
                {item.keyword}
              </span>
              <span style={{
                marginLeft: 'var(--s-sm)',
                fontSize: '0.8rem',
                color: 'var(--c-text-tertiary)',
              }}>
                {item.desc}
              </span>
            </div>
            <span style={idBadgeStyle}>{item.id}</span>
          </button>
        )
      })}
    </div>
  )
}

function SkilledList({ items, selectedIds, onToggle, expandedId, onExpand }: {
  items: SkilledItem[]; selectedIds: Set<number>; onToggle: (id: number) => void
  expandedId: number | null; onExpand: (id: number | null) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-sm)' }}>
      {items.map((item, index) => {
        const selected = selectedIds.has(item.id)
        const expanded = expandedId === item.id
        return (
          <div
            key={item.id}
            className="animate-fade-in-up"
            style={{
              ...cardStyle(selected),
              flexDirection: 'column',
              cursor: 'default',
              animationDelay: `${Math.min(index * 20, 300)}ms`,
            }}
          >
            <button
              onClick={() => onToggle(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--s-md)',
                width: '100%',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <div style={checkboxStyle(selected)}>
                {selected && <span style={{ fontSize: '0.7rem' }}>✓</span>}
              </div>
              <span style={{
                flex: 1,
                textAlign: 'left',
                fontFamily: 'var(--f-display)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: selected ? 'var(--c-accent)' : 'var(--c-text)',
                transition: 'color var(--t-fast)',
              }}>
                {item.talent}
              </span>
              <span style={idBadgeStyle}>{item.id}</span>
            </button>
            <button
              onClick={() => onExpand(expanded ? null : item.id)}
              style={{
                marginLeft: 36,
                fontSize: '0.75rem',
                color: 'var(--c-text-tertiary)',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '2px 0',
              }}
            >
              {expanded ? '收起详情 ▲' : '查看详情 ▼'}
            </button>
            {expanded && (
              <div style={{
                marginLeft: 36,
                marginTop: 'var(--s-xs)',
                padding: 'var(--s-sm) var(--s-md)',
                background: 'var(--c-bg)',
                borderRadius: 'var(--r-sm)',
                fontSize: '0.8rem',
                lineHeight: 1.7,
                animation: 'fadeIn var(--t-fast) ease',
              }}>
                <div style={{ color: 'var(--c-success)' }}>
                  <strong>长处：</strong>{item.strength}
                </div>
                <div style={{ color: 'var(--c-error)', marginTop: 2 }}>
                  <strong>短处：</strong>{item.weakness}
                </div>
              </div>
            )}
          </div>
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

function cardStyle(selected: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--s-md)',
    padding: 'var(--s-md)',
    borderRadius: 'var(--r-md)',
    border: selected
      ? '1.5px solid var(--c-accent)'
      : '1.5px solid var(--c-border-light)',
    background: selected ? 'var(--c-accent-soft)' : 'var(--c-bg-elevated)',
    cursor: 'pointer',
    transition: 'all var(--t-fast) var(--ease-out)',
    boxShadow: selected ? 'none' : 'var(--shadow-sm)',
  }
}

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

const idBadgeStyle: CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--c-text-tertiary)',
  fontFamily: 'var(--f-body)',
  minWidth: 20,
  textAlign: 'right',
}
