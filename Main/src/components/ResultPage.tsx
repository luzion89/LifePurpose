import { useState, useMemo, useRef, useEffect, type CSSProperties } from 'react'
import type { ImportantItem, SkilledItem, LikedItem } from '../data/lists'
import type { AppLanguage } from '../i18n'
import { UI_TEXT } from '../i18n'
import { generatePrompt } from '../utils/prompt'
import { useAIChat } from '../hooks/useAIChat'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { PROVIDER_LABELS, type AIProvider } from '../services/ai'

interface ResultPageProps {
  language: AppLanguage
  importantItems: ImportantItem[]
  skilledItems: SkilledItem[]
  likedItems: LikedItem[]
  onBack: () => void
}

export function ResultPage({ language, importantItems, skilledItems, likedItems, onBack }: ResultPageProps) {
  const [showAI, setShowAI] = useState(false)
  const [copied, setCopied] = useState(false)
  const [promptDraft, setPromptDraft] = useState('')
  const [isPromptCustomized, setIsPromptCustomized] = useState(false)

  const copy = UI_TEXT[language]
  const resultCopy = copy.result

  const generatedPrompt = useMemo(
    () => generatePrompt(language, importantItems, skilledItems, likedItems),
    [language, importantItems, skilledItems, likedItems],
  )

  useEffect(() => {
    if (!isPromptCustomized) {
      setPromptDraft(generatedPrompt)
    }
  }, [generatedPrompt, isPromptCustomized])

  const totalSelected = importantItems.length + skilledItems.length + likedItems.length

  const handlePromptChange = (value: string) => {
    setPromptDraft(value)
    setIsPromptCustomized(value !== generatedPrompt)
  }

  const handleResetPrompt = () => {
    setPromptDraft(generatedPrompt)
    setIsPromptCustomized(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptDraft)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = promptDraft
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (totalSelected === 0) {
    return (
      <div className="container" style={{ paddingTop: 'var(--s-2xl)', textAlign: 'center' }}>
        <p style={{ color: 'var(--c-text-tertiary)', fontSize: '0.9rem' }}>
          {resultCopy.emptyState}
        </p>
        <button onClick={onBack} style={{ ...primaryBtnStyle, marginTop: 'var(--s-lg)' }}>
          {resultCopy.backToSelection}
        </button>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--s-lg)', maxWidth: 980 }}>
      <div className="animate-fade-in-up" style={{ marginBottom: 'var(--s-xl)' }}>
        <h2 style={{ fontFamily: 'var(--f-display)', marginBottom: 'var(--s-xs)' }}>
          {resultCopy.title}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--c-text-secondary)' }}>
          {resultCopy.subtitle.replace('{count}', String(totalSelected))}
        </p>
      </div>

      <div className="animate-fade-in-up stagger-1" style={infoCardStyle}>
        <div style={{
          fontFamily: 'var(--f-display)',
          fontSize: '0.95rem',
          color: 'var(--c-text)',
          marginBottom: 'var(--s-xs)',
        }}>
          {resultCopy.researchTitle}
        </div>
        <p style={{ fontSize: '0.82rem', lineHeight: 1.8 }}>
          {resultCopy.researchBody}
        </p>
      </div>

      <div className="animate-fade-in-up stagger-2" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--s-md)',
        marginBottom: 'var(--s-xl)',
      }}>
        <SummaryCard
          title={resultCopy.summaryTitles.important}
          color="var(--c-accent)"
          items={importantItems.map(item => item.keyword)}
          emptyLabel={copy.common.notSelected}
        />
        <SummaryCard
          title={resultCopy.summaryTitles.skilled}
          color="var(--c-success)"
          items={skilledItems.map(item => item.talent)}
          emptyLabel={copy.common.notSelected}
        />
        <SummaryCard
          title={resultCopy.summaryTitles.liked}
          color="#7B9EC4"
          items={likedItems.map(item => item.name)}
          emptyLabel={copy.common.notSelected}
        />
      </div>

      <div className="animate-fade-in-up stagger-3" style={{ marginBottom: 'var(--s-xl)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--s-md)',
          marginBottom: 'var(--s-sm)',
          flexWrap: 'wrap',
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1rem', marginBottom: 4 }}>
              {resultCopy.promptTitle}
            </h3>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.7 }}>
              {resultCopy.promptHint}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--s-sm)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {isPromptCustomized && (
              <span style={customizedBadgeStyle}>
                {resultCopy.promptCustomized}
              </span>
            )}
            <button onClick={handleResetPrompt} style={secondaryBtnStyle}>
              {resultCopy.promptReset}
            </button>
            <button onClick={handleCopy} style={secondaryBtnStyle}>
              {copied ? resultCopy.copied : resultCopy.copyPrompt}
            </button>
          </div>
        </div>

        <textarea
          value={promptDraft}
          onChange={e => handlePromptChange(e.target.value)}
          style={{
            width: '100%',
            minHeight: 420,
            padding: 'var(--s-lg)',
            background: 'var(--c-bg-elevated)',
            border: '1px solid var(--c-border-light)',
            borderRadius: 'var(--r-lg)',
            fontSize: '0.82rem',
            lineHeight: 1.75,
            color: 'var(--c-text-secondary)',
            resize: 'vertical',
            fontFamily: 'var(--f-body)',
            boxShadow: 'var(--shadow-sm)',
            outline: 'none',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--c-accent)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--c-border-light)'}
        />
      </div>

      <div className="animate-fade-in-up stagger-4" style={{
        display: 'flex',
        gap: 'var(--s-md)',
        flexWrap: 'wrap',
        marginBottom: 'var(--s-xl)',
      }}>
        <button onClick={() => setShowAI(true)} style={primaryBtnStyle}>
          {resultCopy.askAi}
        </button>
        <button onClick={handleCopy} style={secondaryBtnStyle}>
          {copied ? resultCopy.copied : resultCopy.copyPrompt}
        </button>
        <button onClick={onBack} style={secondaryBtnStyle}>
          {resultCopy.reselect}
        </button>
      </div>

      {showAI && (
        <AIChatOverlay
          language={language}
          prompt={promptDraft}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  )
}

function SummaryCard({
  title,
  color,
  items,
  emptyLabel,
}: {
  title: string
  color: string
  items: string[]
  emptyLabel: string
}) {
  return (
    <div style={{
      padding: 'var(--s-md)',
      borderRadius: 'var(--r-md)',
      border: '1px solid var(--c-border-light)',
      background: 'var(--c-bg-elevated)',
    }}>
      <h4 style={{
        fontFamily: 'var(--f-display)',
        fontSize: '0.84rem',
        color,
        marginBottom: 'var(--s-sm)',
        letterSpacing: '0.03em',
      }}>
        {title}
        <span style={{ marginLeft: 'var(--s-xs)', fontSize: '0.7rem', opacity: 0.7 }}>
          ({items.length})
        </span>
      </h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {items.map(name => (
          <span
            key={name}
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--r-pill)',
              background: `color-mix(in srgb, ${color} 8%, transparent)`,
              color,
              fontSize: '0.72rem',
              fontWeight: 500,
            }}
          >
            {name}
          </span>
        ))}
        {items.length === 0 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--c-text-tertiary)' }}>
            {emptyLabel}
          </span>
        )}
      </div>
    </div>
  )
}

function AIChatOverlay({ language, prompt, onClose }: { language: AppLanguage; prompt: string; onClose: () => void }) {
  const [provider, setProvider] = useLocalStorage<AIProvider>('lp-ai-provider', 'openai')
  const [apiKey, setApiKey] = useLocalStorage(`lp-api-key-${provider}`, '')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const { messages, isStreaming, error, sendMessage, clearMessages } = useAIChat(provider, apiKey, prompt)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const hasSentRef = useRef(false)
  const resultCopy = UI_TEXT[language].result

  useEffect(() => {
    if (apiKey && !hasSentRef.current && messages.length === 0) {
      hasSentRef.current = true
      sendMessage(resultCopy.initialRequest)
    }
  }, [apiKey, messages.length, resultCopy.initialRequest, sendMessage])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={overlayStyle}>
      <div style={overlayHeaderStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-md)' }}>
          <button onClick={onClose} style={{ fontSize: '0.85rem', color: 'var(--c-text-secondary)', cursor: 'pointer' }}>
            {resultCopy.aiBack}
          </button>
          <select
            value={provider}
            onChange={e => {
              setProvider(e.target.value as AIProvider)
              clearMessages()
              hasSentRef.current = false
            }}
            style={providerSelectStyle}
          >
            {(Object.entries(PROVIDER_LABELS) as [AIProvider, string][]).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowKeyInput(prev => !prev)}
          style={{
            fontSize: '0.78rem',
            color: apiKey ? 'var(--c-success)' : 'var(--c-error)',
            cursor: 'pointer',
          }}
        >
          {apiKey ? resultCopy.configured : resultCopy.setKey}
        </button>
      </div>

      {showKeyInput && (
        <div style={apiKeyPanelStyle}>
          <div style={{ marginBottom: 'var(--s-xs)' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--c-text-secondary)' }}>
              {PROVIDER_LABELS[provider]} {resultCopy.apiKeyLabel}
            </label>
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder={resultCopy.apiKeyPlaceholder}
            style={apiKeyInputStyle}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--c-accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
          />
          <p style={{ marginTop: 'var(--s-xs)', fontSize: '0.7rem', color: 'var(--c-text-tertiary)' }}>
            {resultCopy.apiKeyHint}
            {provider === 'claude' && resultCopy.apiKeyClaudeHint}
          </p>
        </div>
      )}

      {!apiKey && !showKeyInput && (
        <div style={emptyChatStateStyle}>
          <p style={{ fontSize: '0.9rem', color: 'var(--c-text-secondary)', marginBottom: 'var(--s-md)' }}>
            {resultCopy.noApiKey}
          </p>
          <button onClick={() => setShowKeyInput(true)} style={primaryBtnStyle}>
            {resultCopy.openKey}
          </button>
        </div>
      )}

      {apiKey && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--s-lg)' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: 'var(--s-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '88%',
                padding: 'var(--s-md)',
                borderRadius: msg.role === 'user'
                  ? 'var(--r-lg) var(--r-lg) var(--r-sm) var(--r-lg)'
                  : 'var(--r-lg) var(--r-lg) var(--r-lg) var(--r-sm)',
                background: msg.role === 'user' ? 'var(--c-accent)' : 'var(--c-bg-elevated)',
                color: msg.role === 'user' ? '#fff' : 'var(--c-text)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--c-border-light)',
                fontSize: '0.85rem',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.role === 'user'
                  ? (msg.content.length > 120 ? `${msg.content.slice(0, 120)}${resultCopy.sentPromptSuffix}` : msg.content)
                  : (msg.content || (isStreaming ? resultCopy.thinking : ''))}
              </div>
            </div>
          ))}

          {error && (
            <div style={{
              padding: 'var(--s-md)',
              background: 'rgba(212,117,106,0.08)',
              borderRadius: 'var(--r-md)',
              fontSize: '0.82rem',
              color: 'var(--c-error)',
            }}>
              {error}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      )}

      {isStreaming && (
        <div style={{
          padding: 'var(--s-sm) var(--s-lg)',
          borderTop: '1px solid var(--c-border-light)',
          fontSize: '0.75rem',
          color: 'var(--c-text-tertiary)',
          textAlign: 'center',
        }}>
          {resultCopy.aiTyping}
        </div>
      )}
    </div>
  )
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--c-bg)',
  animation: 'slideInRight var(--t-normal) var(--ease-out)',
}

const overlayHeaderStyle: CSSProperties = {
  padding: 'var(--s-md) var(--s-lg)',
  borderBottom: '1px solid var(--c-border-light)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'var(--c-bg-elevated)',
}

const providerSelectStyle: CSSProperties = {
  padding: '4px 8px',
  borderRadius: 'var(--r-sm)',
  border: '1px solid var(--c-border)',
  fontSize: '0.78rem',
  fontFamily: 'var(--f-body)',
  color: 'var(--c-text)',
  background: 'var(--c-bg)',
  cursor: 'pointer',
}

const apiKeyPanelStyle: CSSProperties = {
  padding: 'var(--s-md) var(--s-lg)',
  borderBottom: '1px solid var(--c-border-light)',
  background: 'var(--c-bg-elevated)',
  animation: 'fadeIn var(--t-fast) ease',
}

const apiKeyInputStyle: CSSProperties = {
  width: '100%',
  padding: 'var(--s-sm) var(--s-md)',
  border: '1px solid var(--c-border)',
  borderRadius: 'var(--r-sm)',
  fontSize: '0.82rem',
  fontFamily: 'monospace',
  background: 'var(--c-bg)',
  color: 'var(--c-text)',
  outline: 'none',
}

const emptyChatStateStyle: CSSProperties = {
  padding: 'var(--s-xl) var(--s-lg)',
  textAlign: 'center',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

const infoCardStyle: CSSProperties = {
  marginBottom: 'var(--s-lg)',
  padding: 'var(--s-md) var(--s-lg)',
  borderRadius: 'var(--r-md)',
  background: 'linear-gradient(135deg, rgba(192,153,75,0.12), rgba(123,158,196,0.12))',
  border: '1px solid var(--c-border-light)',
}

const customizedBadgeStyle: CSSProperties = {
  padding: '4px 10px',
  borderRadius: 'var(--r-pill)',
  background: 'rgba(123, 174, 127, 0.12)',
  color: 'var(--c-success)',
  fontSize: '0.72rem',
  fontWeight: 600,
}

const primaryBtnStyle: CSSProperties = {
  padding: 'var(--s-sm) var(--s-lg)',
  background: 'var(--c-accent)',
  color: '#fff',
  borderRadius: 'var(--r-pill)',
  fontWeight: 600,
  fontSize: '0.85rem',
  letterSpacing: '0.02em',
  cursor: 'pointer',
  border: 'none',
  transition: 'background var(--t-fast)',
}

const secondaryBtnStyle: CSSProperties = {
  padding: 'var(--s-sm) var(--s-lg)',
  background: 'transparent',
  color: 'var(--c-text-secondary)',
  borderRadius: 'var(--r-pill)',
  fontWeight: 500,
  fontSize: '0.85rem',
  border: '1px solid var(--c-border)',
  cursor: 'pointer',
  transition: 'all var(--t-fast)',
}