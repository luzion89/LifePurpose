import { useState, useCallback, useRef } from 'react'
import { streamChat, type AIProvider, type ChatMessage } from '../services/ai'

interface UseAIChatReturn {
  messages: ChatMessage[]
  isStreaming: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

export function useAIChat(provider: AIProvider, apiKey: string): UseAIChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!apiKey) {
      setError('请先设置 API Key')
      return
    }

    const userMsg: ChatMessage = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setIsStreaming(true)
    setError(null)

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    const assistantMsg: ChatMessage = { role: 'assistant', content: '' }
    setMessages([...newMessages, assistantMsg])

    try {
      let fullContent = ''
      for await (const chunk of streamChat(provider, apiKey, newMessages, abortRef.current.signal)) {
        fullContent += chunk
        setMessages([...newMessages, { role: 'assistant', content: fullContent }])
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      const message = err instanceof Error ? err.message : '请求失败，请检查 API Key 和网络连接'
      setError(message)
      // Remove empty assistant message on error
      setMessages(newMessages)
    } finally {
      setIsStreaming(false)
    }
  }, [messages, provider, apiKey])

  const clearMessages = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
  }, [])

  return { messages, isStreaming, error, sendMessage, clearMessages }
}
