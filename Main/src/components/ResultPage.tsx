import { useState, useMemo, useRef, useEffect, type CSSProperties } from 'react'
import { importantList, skilledList, likedList } from '../data/lists'
import { generatePrompt } from '../utils/prompt'
import { useAIChat } from '../hooks/useAIChat'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { PROVIDER_LABELS, type AIProvider } from '../services/ai'

interface ResultPageProps {
  importantIds: Set<number>
  skilledIds: Set<number>
  likedIds: Set<number>
  onBack: () => void
}

export function ResultPage({ importantIds, skilledIds, likedIds, onBack }: ResultPageProps) {
  const [showAI, setShowAI] = useState(false)
  const [copied, setCopied] = useState(false)

  const selectedImportant = useMemo(
    () => importantList.filter(i => importantIds.has(i.id)),
    [importantIds],
  )
  const selectedSkilled = useMemo(
    () => skilledList.filter(i => skilledIds.has(i.id)),
    [skilledIds],
  )
  const selectedLiked = useMemo(
    () => likedList.filter(i => likedIds.has(i.id)),
    [likedIds],
  )

  const prompt = useMemo(
    () => generatePrompt(selectedImportant, selectedSkilled, selectedLiked),
    [selectedImportant, selectedSkilled, selectedLiked],
  )

  const totalSelected = importantIds.size + skilledIds.size + likedIds.size

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = prompt
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (totalSelected === 0) {
    return (
      <div className="container" style={{ paddingTop: 'var(--s-2xl)', textAlign: 'center' }}>
        <p style={{ color: 'var(--c-text-tertiary)', fontSize: '0.9rem' }}>
          你还没有选择任何条目。请先回到前面的步骤进行勾选。
        </p>
        <button onClick={onBack} style={{ ...primaryBtnStyle, marginTop: 'var(--s-lg)' }}>
          ← 返回选择
        </button>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--s-lg)' }}>
      {/* Summary header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 'var(--s-xl)' }}>
        <h2 style={{ fontFamily: 'var(--f-display)', marginBottom: 'var(--s-xs)' }}>
          你的自我探索结果
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--c-text-secondary)' }}>
          共选择了 {totalSelected} 个条目，已生成个性化提示词
        </p>
      </div>

      {/* Three columns summary */}
      <div className="animate-fade-in-up stagger-1" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'var(--s-md)',
        marginBottom: 'var(--s-xl)',
      }}>
        <SummaryCard title="重要的事" color="var(--c-accent)" items={selectedImportant.map(i => i.keyword)} />
        <SummaryCard title="擅长的事" color="var(--c-success)" items={selectedSkilled.map(i => i.talent)} />
        <SummaryCard title="喜欢的事" color="#7B9EC4" items={selectedLiked.map(i => i.name)} />
      </div>

      {/* Prompt preview */}
      <div className="animate-fade-in-up stagger-2" style={{ marginBottom: 'var(--s-lg)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--s-sm)',
        }}>
          <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '0.95rem' }}>
            生成的提示词
          </h3>
          <button
            onClick={handleCopy}
            style={{
              padding: 'var(--s-xs) var(--s-md)',
              borderRadius: 'var(--r-pill)',
              border: '1px solid var(--c-border)',
              fontSize: '0.78rem',
              color: copied ? 'var(--c-success)' : 'var(--c-text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--t-fast)',
              background: copied ? 'rgba(123,174,127,0.08)' : 'transparent',
            }}
          >
            {copied ? '✓ 已复制' : '复制提示词'}
          </button>
        </div>
        <pre style={{
          padding: 'var(--s-md)',
          background: 'var(--c-bg-elevated)',
          border: '1px solid var(--c-border-light)',
          borderRadius: 'var(--r-md)',
          fontSize: '0.78rem',
          lineHeight: 1.7,
          color: 'var(--c-text-secondary)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: 300,
          overflowY: 'auto',
          fontFamily: 'var(--f-body)',
        }}>
          {prompt}
        </pre>
      </div>

      {/* Action buttons */}
      <div className="animate-fade-in-up stagger-3" style={{
        display: 'flex',
        gap: 'var(--s-md)',
        flexWrap: 'wrap',
        marginBottom: 'var(--s-xl)',
      }}>
        <button onClick={() => setShowAI(true)} style={primaryBtnStyle}>
          在 App 内问 AI ✦
        </button>
        <button onClick={handleCopy} style={secondaryBtnStyle}>
          {copied ? '✓ 已复制' : '复制至剪贴板'}
        </button>
        <button onClick={onBack} style={secondaryBtnStyle}>
          ← 重新选择
        </button>
      </div>

      {/* AI Chat Panel */}
      {showAI && (
        <AIChatOverlay
          prompt={prompt}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  )
}

/* ===== Summary Card ===== */

function SummaryCard({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div style={{
      padding: 'var(--s-md)',
      borderRadius: 'var(--r-md)',
      border: '1px solid var(--c-border-light)',
      background: 'var(--c-bg-elevated)',
    }}>
      <h4 style={{
        fontFamily: 'var(--f-display)',
        fontSize: '0.82rem',
        color,
        marginBottom: 'var(--s-sm)',
        letterSpacing: '0.03em',
      }}>
        {title}
        <span style={{
          marginLeft: 'var(--s-xs)',
          fontSize: '0.7rem',
          opacity: 0.7,
        }}>
          ({items.length})
        </span>
      </h4>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
      }}>
        {items.map((name, i) => (
          <span key={i} style={{
            padding: '2px 8px',
            borderRadius: 'var(--r-pill)',
            background: `color-mix(in srgb, ${color} 8%, transparent)`,
            color,
            fontSize: '0.72rem',
            fontWeight: 500,
          }}>
            {name}
          </span>
        ))}
        {items.length === 0 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--c-text-tertiary)' }}>
            未选择
          </span>
        )}
      </div>
    </div>
  )
}

/* ===== AI Chat Overlay ===== */

function AIChatOverlay({ prompt, onClose }: { prompt: string; onClose: () => void }) {
  const [provider, setProvider] = useLocalStorage<AIProvider>('lp-ai-provider', 'openai')
  const [apiKey, setApiKey] = useLocalStorage('lp-api-key-' + provider, '')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const { messages, isStreaming, error, sendMessage, clearMessages } = useAIChat(provider, apiKey)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const hasSentRef = useRef(false)

  // Auto-send prompt on first open
  useEffect(() => {
    if (apiKey && !hasSentRef.current && messages.length === 0) {
      hasSentRef.current = true
      sendMessage(prompt)
    }
  }, [apiKey, messages.length, prompt, sendMessage])

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--c-bg)',
    animation: 'slideInRight var(--t-normal) var(--ease-out)',
  }

  return (
    <div style={overlayStyle}>
      {/* Header */}
      <div style={{
        padding: 'var(--s-md) var(--s-lg)',
        borderBottom: '1px solid var(--c-border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--c-bg-elevated)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-md)' }}>
          <button onClick={onClose} style={{
            fontSize: '0.85rem',
            color: 'var(--c-text-secondary)',
            cursor: 'pointer',
          }}>
            ← 返回
          </button>
          <select
            value={provider}
            onChange={e => {
              setProvider(e.target.value as AIProvider)
              clearMessages()
              hasSentRef.current = false
            }}
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--c-border)',
              fontSize: '0.78rem',
              fontFamily: 'var(--f-body)',
              color: 'var(--c-text)',
              background: 'var(--c-bg)',
              cursor: 'pointer',
            }}
          >
            {(Object.entries(PROVIDER_LABELS) as [AIProvider, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          style={{
            fontSize: '0.78rem',
            color: apiKey ? 'var(--c-success)' : 'var(--c-error)',
            cursor: 'pointer',
          }}
        >
          {apiKey ? '🔑 已配置' : '⚙ 设置 Key'}
        </button>
      </div>

      {/* API Key input */}
      {showKeyInput && (
        <div style={{
          padding: 'var(--s-md) var(--s-lg)',
          borderBottom: '1px solid var(--c-border-light)',
          background: 'var(--c-bg-elevated)',
          animation: 'fadeIn var(--t-fast) ease',
        }}>
          <div style={{ marginBottom: 'var(--s-xs)' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--c-text-secondary)' }}>
              {PROVIDER_LABELS[provider]} API Key
            </label>
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="sk-..."
            style={{
              width: '100%',
              padding: 'var(--s-sm) var(--s-md)',
              border: '1px solid var(--c-border)',
              borderRadius: 'var(--r-sm)',
              fontSize: '0.82rem',
              fontFamily: 'monospace',
              background: 'var(--c-bg)',
              color: 'var(--c-text)',
              outline: 'none',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--c-accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
          />
          <p style={{
            marginTop: 'var(--s-xs)',
            fontSize: '0.7rem',
            color: 'var(--c-text-tertiary)',
          }}>
            Key 仅保存在本地浏览器中，不会上传到任何服务器。
            {provider === 'claude' && ' ⚠ Claude API 可能存在浏览器端 CORS 限制，建议使用 OpenAI 或 DeepSeek。'}
          </p>
        </div>
      )}

      {/* No key notice */}
      {!apiKey && !showKeyInput && (
        <div style={{
          padding: 'var(--s-xl) var(--s-lg)',
          textAlign: 'center',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--c-text-secondary)',
            marginBottom: 'var(--s-md)',
          }}>
            请先设置 API Key 以开始 AI 对话
          </p>
          <button
            onClick={() => setShowKeyInput(true)}
            style={primaryBtnStyle}
          >
            设置 API Key
          </button>
        </div>
      )}

      {/* Chat messages */}
      {apiKey && (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--s-lg)',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              marginBottom: 'var(--s-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '85%',
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
                  ? (msg.content.length > 100 ? msg.content.slice(0, 100) + '...(提示词已发送)' : msg.content)
                  : (msg.content || (isStreaming ? '思考中...' : ''))
                }
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

      {/* Streaming indicator */}
      {isStreaming && (
        <div style={{
          padding: 'var(--s-sm) var(--s-lg)',
          borderTop: '1px solid var(--c-border-light)',
          fontSize: '0.75rem',
          color: 'var(--c-text-tertiary)',
          textAlign: 'center',
        }}>
          AI 正在回复中...
        </div>
      )}
    </div>
  )
}

/* ===== Shared styles ===== */

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
