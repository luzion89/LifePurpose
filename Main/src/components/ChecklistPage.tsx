import { useState, useMemo, type CSSProperties } from 'react'
import type { ImportantItem, SkilledItem, LikedItem } from '../data/lists'
import type { AppLanguage } from '../i18n'
import { UI_TEXT } from '../i18n'
import { isCustomOptionId } from '../utils/customOptions'

type ListType = 'important' | 'skilled' | 'liked'

interface ChecklistPageBaseProps {
  language: AppLanguage
  selectedIds: Set<number>
  onToggle: (id: number) => void
  onNext: () => void
  onPrev?: () => void
}

interface ImportantChecklistPageProps extends ChecklistPageBaseProps {
  type: 'important'
  items: ImportantItem[]
  onCreateCustomOption: (item: Omit<ImportantItem, 'id'>) => number
}

interface SkilledChecklistPageProps extends ChecklistPageBaseProps {
  type: 'skilled'
  items: SkilledItem[]
  onCreateCustomOption: (item: Omit<SkilledItem, 'id'>) => number
}

interface LikedChecklistPageProps extends ChecklistPageBaseProps {
  type: 'liked'
  items: LikedItem[]
  onCreateCustomOption: (item: Omit<LikedItem, 'id'>) => number
}

type ChecklistPageProps = ImportantChecklistPageProps | SkilledChecklistPageProps | LikedChecklistPageProps

export function ChecklistPage(props: ChecklistPageProps) {
  const { language, type, items, selectedIds, onToggle, onNext, onPrev } = props
  const [search, setSearch] = useState('')
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customFields, setCustomFields] = useState<Record<string, string>>({})

  const copy = UI_TEXT[language]
  const stepCopy = copy.steps[type]

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const query = search.trim().toLowerCase()

    return items.filter(item => {
      if ('keyword' in item) return item.keyword.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
      if ('talent' in item) return item.talent.toLowerCase().includes(query) || item.strength.toLowerCase().includes(query) || item.weakness.toLowerCase().includes(query)
      if ('name' in item) return item.name.toLowerCase().includes(query)
      return false
    })
  }, [items, search])

  const isLiked = type === 'liked'
  const canSubmitCustom = getRequiredFields(type).every(field => customFields[field]?.trim())

  const handleCustomFieldChange = (field: string, value: string) => {
    setCustomFields(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCustomSubmit = () => {
    if (!canSubmitCustom) return

    if (type === 'important') {
      props.onCreateCustomOption({
        keyword: customFields.keyword.trim(),
        desc: customFields.desc.trim(),
      })
    } else if (type === 'skilled') {
      props.onCreateCustomOption({
        talent: customFields.talent.trim(),
        strength: customFields.strength.trim(),
        weakness: customFields.weakness.trim(),
      })
    } else {
      props.onCreateCustomOption({
        name: customFields.name.trim(),
      })
    }

    setCustomFields({})
    setShowCustomForm(false)
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--s-md)', paddingBottom: 100 }}>
      <div className="animate-fade-in-up" style={{ marginBottom: 'var(--s-md)' }}>
        <h2 style={{
          fontFamily: 'var(--f-display)',
          color: 'var(--c-text)',
          fontSize: '1.3rem',
          marginBottom: 2,
        }}>
          {stepCopy.title}
        </h2>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--c-text-secondary)',
          lineHeight: 1.7,
        }}>
          {stepCopy.description}
        </p>
      </div>

      <GuidePanel language={language} type={type} />

      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--c-bg)',
        paddingTop: 'var(--s-xs)',
        paddingBottom: 'var(--s-sm)',
        marginBottom: 'var(--s-sm)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 'var(--s-sm)',
          alignItems: 'center',
        }}>
          <input
            type="text"
            placeholder={stepCopy.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={searchInputStyle}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--c-accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
          />
          <button
            onClick={() => setShowCustomForm(prev => !prev)}
            style={{
              ...navBtnStyle('secondary'),
              padding: '8px 12px',
              whiteSpace: 'nowrap',
            }}
          >
            {stepCopy.customButton}
          </button>
        </div>

        {showCustomForm && (
          <div className="animate-fade-in-up" style={{
            marginTop: 'var(--s-sm)',
            padding: 'var(--s-md)',
            borderRadius: 'var(--r-md)',
            background: 'var(--c-bg-elevated)',
            border: '1px solid var(--c-border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ marginBottom: 'var(--s-sm)' }}>
              <div style={{
                fontFamily: 'var(--f-display)',
                fontSize: '0.92rem',
                color: 'var(--c-text)',
              }}>
                {stepCopy.customTitle}
              </div>
              <p style={{ fontSize: '0.78rem', marginTop: 2 }}>
                {stepCopy.customDescription}
              </p>
            </div>

            <div style={{ display: 'grid', gap: 'var(--s-sm)' }}>
              {Object.entries(stepCopy.fields).map(([field, meta]) => (
                <label key={field} style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--c-text-secondary)' }}>
                    {meta.label}
                  </span>
                  {field === 'desc' || field === 'strength' || field === 'weakness' ? (
                    <textarea
                      value={customFields[field] ?? ''}
                      onChange={e => handleCustomFieldChange(field, e.target.value)}
                      placeholder={meta.placeholder}
                      rows={3}
                      style={{ ...searchInputStyle, resize: 'vertical', minHeight: 72 }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={customFields[field] ?? ''}
                      onChange={e => handleCustomFieldChange(field, e.target.value)}
                      placeholder={meta.placeholder}
                      style={searchInputStyle}
                    />
                  )}
                </label>
              ))}
            </div>

            <div style={{
              display: 'flex',
              gap: 'var(--s-sm)',
              marginTop: 'var(--s-md)',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={handleCustomSubmit}
                disabled={!canSubmitCustom}
                style={{
                  ...navBtnStyle('primary'),
                  opacity: canSubmitCustom ? 1 : 0.45,
                  cursor: canSubmitCustom ? 'pointer' : 'not-allowed',
                }}
              >
                {stepCopy.customSubmit}
              </button>
              <button
                onClick={() => {
                  setShowCustomForm(false)
                  setCustomFields({})
                }}
                style={navBtnStyle('secondary')}
              >
                {stepCopy.customCancel}
              </button>
            </div>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={emptyStateStyle}>
          {stepCopy.emptySearch}
        </div>
      ) : isLiked ? (
        <LikedGrid
          items={filtered as LikedItem[]}
          selectedIds={selectedIds}
          onToggle={onToggle}
          customBadge={stepCopy.customBadge}
        />
      ) : type === 'important' ? (
        <ImportantList
          items={filtered as ImportantItem[]}
          selectedIds={selectedIds}
          onToggle={onToggle}
          customBadge={stepCopy.customBadge}
        />
      ) : (
        <SkilledList
          items={filtered as SkilledItem[]}
          selectedIds={selectedIds}
          onToggle={onToggle}
          customBadge={stepCopy.customBadge}
        />
      )}

      <div style={bottomBarStyle}>
        <div style={{
          maxWidth: 680,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-md)' }}>
            {onPrev && (
              <button onClick={onPrev} style={navBtnStyle('secondary')}>
                {copy.common.previous}
              </button>
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--c-text-secondary)' }}>
              {copy.common.selected}{' '}
              <strong style={{ color: 'var(--c-accent)' }}>{selectedIds.size}</strong>
            </span>
          </div>
          <button onClick={onNext} style={navBtnStyle('primary')}>
            {copy.common.next}
          </button>
        </div>
      </div>
    </div>
  )
}

function GuidePanel({ language, type }: { language: AppLanguage; type: ListType }) {
  const copy = UI_TEXT[language].steps[type]

  return (
    <div className="animate-fade-in-up stagger-1" style={{
      marginBottom: 'var(--s-md)',
      padding: 'var(--s-md) var(--s-lg)',
      borderRadius: 'var(--r-lg)',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(243,240,235,0.88))',
      border: '1px solid var(--c-border-light)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--s-md)',
        flexWrap: 'wrap',
        marginBottom: 'var(--s-sm)',
      }}>
        <div style={{
          fontFamily: 'var(--f-display)',
          fontSize: '0.98rem',
          color: 'var(--c-text)',
        }}>
          {copy.guideTitle}
        </div>
        <span style={{
          padding: '2px 10px',
          borderRadius: 'var(--r-pill)',
          background: 'var(--c-accent-soft)',
          color: 'var(--c-accent-hover)',
          fontSize: '0.72rem',
          fontWeight: 600,
        }}>
          {copy.recommendedRange}
        </span>
      </div>

      <p style={{ fontSize: '0.82rem', lineHeight: 1.8, marginBottom: 'var(--s-md)' }}>
        {copy.guideIntro}
      </p>

      {copy.englishModeNote && language === 'en' && (
        <div style={{
          marginBottom: 'var(--s-md)',
          padding: 'var(--s-sm) var(--s-md)',
          borderRadius: 'var(--r-md)',
          background: 'rgba(123, 158, 196, 0.10)',
          border: '1px solid rgba(123, 158, 196, 0.18)',
          fontSize: '0.76rem',
          color: '#5C7692',
          lineHeight: 1.7,
        }}>
          {copy.englishModeNote}
        </div>
      )}

      <div style={{ display: 'grid', gap: 'var(--s-sm)', marginBottom: 'var(--s-md)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--c-text)' }}>
          {copy.chooseTitle}
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          {copy.chooseTips.map(tip => (
            <div key={tip} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--c-accent)', fontSize: '0.8rem', marginTop: 2 }}>•</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--c-text-secondary)', lineHeight: 1.7 }}>
                {tip}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 'var(--s-sm)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--c-text)' }}>
          {copy.meaningTitle}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--s-sm)',
        }}>
          {copy.meaningCards.map(card => (
            <div key={card.label} style={{
              padding: 'var(--s-sm) var(--s-md)',
              borderRadius: 'var(--r-md)',
              background: 'var(--c-bg-elevated)',
              border: '1px solid var(--c-border-light)',
            }}>
              <div style={{
                fontSize: '0.76rem',
                fontWeight: 600,
                color: 'var(--c-accent-hover)',
                marginBottom: 4,
              }}>
                {card.label}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--c-text-secondary)',
                lineHeight: 1.6,
              }}>
                {card.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ImportantList({ items, selectedIds, onToggle, customBadge }: {
  items: ImportantItem[]
  selectedIds: Set<number>
  onToggle: (id: number) => void
  customBadge: string
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--s-xs)',
    }}>
      {items.map((item, index) => {
        const selected = selectedIds.has(item.id)
        const custom = isCustomOptionId(item.id)
        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className="animate-fade-in-up"
            style={listCardStyle(selected, index)}
          >
            <div style={{ ...checkboxStyle(selected), marginTop: 2 }}>
              {selected && <span style={{ fontSize: '0.65rem' }}>✓</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexWrap: 'wrap',
              }}>
                <div style={{
                  fontFamily: 'var(--f-display)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: selected ? 'var(--c-accent)' : 'var(--c-text)',
                  transition: 'color var(--t-fast)',
                }}>
                  {item.keyword}
                </div>
                {custom && <CustomBadge label={customBadge} />}
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--c-text-tertiary)',
                marginTop: 1,
                lineHeight: 1.5,
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

function SkilledList({ items, selectedIds, onToggle, customBadge }: {
  items: SkilledItem[]
  selectedIds: Set<number>
  onToggle: (id: number) => void
  customBadge: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, index) => {
        const selected = selectedIds.has(item.id)
        const custom = isCustomOptionId(item.id)
        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className="animate-fade-in-up"
            style={listCardStyle(selected, index)}
          >
            <div style={{ ...checkboxStyle(selected), marginTop: 3, flexShrink: 0 }}>
              {selected && <span style={{ fontSize: '0.65rem' }}>✓</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexWrap: 'wrap',
                marginBottom: 4,
              }}>
                <div style={{
                  fontFamily: 'var(--f-display)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: selected ? 'var(--c-accent)' : 'var(--c-text)',
                  transition: 'color var(--t-fast)',
                }}>
                  {item.talent}
                </div>
                {custom && <CustomBadge label={customBadge} />}
              </div>
              <div style={strengthTextStyle}>
                <span style={{ flexShrink: 0, opacity: 0.7 }}>↑</span>
                <span>{item.strength}</span>
              </div>
              <div style={weaknessTextStyle}>
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

function LikedGrid({ items, selectedIds, onToggle, customBadge }: {
  items: LikedItem[]
  selectedIds: Set<number>
  onToggle: (id: number) => void
  customBadge: string
}) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--s-sm)',
    }}>
      {items.map((item, index) => {
        const selected = selectedIds.has(item.id)
        const custom = isCustomOptionId(item.id)
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
              whiteSpace: 'normal',
              lineHeight: 1.45,
              textAlign: 'left',
              maxWidth: '100%',
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
            <span>{item.name}</span>
            {custom && (
              <span style={{
                marginLeft: 6,
                fontSize: '0.72rem',
                opacity: 0.72,
              }}>
                · {customBadge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function CustomBadge({ label }: { label: string }) {
  return (
    <span style={{
      padding: '1px 7px',
      borderRadius: 'var(--r-pill)',
      background: 'rgba(123, 158, 196, 0.12)',
      color: '#6A89AB',
      fontSize: '0.66rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    }}>
      {label}
    </span>
  )
}

function getRequiredFields(type: ListType): string[] {
  if (type === 'important') return ['keyword', 'desc']
  if (type === 'skilled') return ['talent', 'strength', 'weakness']
  return ['name']
}

function listCardStyle(selected: boolean, index: number): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
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
  }
}

const strengthTextStyle: CSSProperties = {
  fontSize: '0.75rem',
  color: '#5a8a5a',
  lineHeight: 1.45,
  display: 'flex',
  gap: 4,
}

const weaknessTextStyle: CSSProperties = {
  fontSize: '0.75rem',
  color: '#9a6a3a',
  lineHeight: 1.45,
  marginTop: 2,
  display: 'flex',
  gap: 4,
}

const searchInputStyle: CSSProperties = {
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
}

const emptyStateStyle: CSSProperties = {
  padding: 'var(--s-lg)',
  borderRadius: 'var(--r-md)',
  background: 'var(--c-bg-elevated)',
  border: '1px dashed var(--c-border)',
  color: 'var(--c-text-secondary)',
  fontSize: '0.82rem',
  lineHeight: 1.7,
}

const bottomBarStyle: CSSProperties = {
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