export type AIProvider = 'openai' | 'deepseek' | 'claude'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ProviderConfig {
  url: string
  headers: (apiKey: string) => Record<string, string>
  buildBody: (messages: ChatMessage[]) => string
  parseStream: (line: string) => string | null
}

const OPENAI_COMPATIBLE = (url: string, model: string): ProviderConfig => ({
  url,
  headers: (apiKey) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  }),
  buildBody: (messages) => JSON.stringify({
    model,
    messages,
    stream: true,
    temperature: 0.8,
    max_tokens: 4096,
  }),
  parseStream: (line) => {
    if (!line.startsWith('data: ')) return null
    const data = line.slice(6).trim()
    if (data === '[DONE]') return null
    try {
      const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> }
      return parsed.choices?.[0]?.delta?.content ?? null
    } catch {
      return null
    }
  },
})

const PROVIDERS: Record<AIProvider, ProviderConfig> = {
  openai: OPENAI_COMPATIBLE(
    'https://api.openai.com/v1/chat/completions',
    'gpt-4o-mini',
  ),
  deepseek: OPENAI_COMPATIBLE(
    'https://api.deepseek.com/v1/chat/completions',
    'deepseek-chat',
  ),
  claude: {
    url: 'https://api.anthropic.com/v1/messages',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    }),
    buildBody: (messages) => {
      // Claude uses a different format: separate system from user/assistant
      const systemMsg = messages.find(m => m.role === 'system')
      const nonSystem = messages.filter(m => m.role !== 'system')
      return JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        stream: true,
        ...(systemMsg ? { system: systemMsg.content } : {}),
        messages: nonSystem.map(m => ({ role: m.role, content: m.content })),
      })
    },
    parseStream: (line) => {
      if (!line.startsWith('data: ')) return null
      const data = line.slice(6).trim()
      try {
        const parsed = JSON.parse(data) as { type?: string; delta?: { text?: string } }
        if (parsed.type === 'content_block_delta') {
          return parsed.delta?.text ?? null
        }
        return null
      } catch {
        return null
      }
    },
  },
}

export async function* streamChat(
  provider: AIProvider,
  apiKey: string,
  messages: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const config = PROVIDERS[provider]

  const response = await fetch(config.url, {
    method: 'POST',
    headers: config.headers(apiKey),
    body: config.buildBody(messages),
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    let errorMessage = `API 请求失败 (${response.status})`
    try {
      const errorJson = JSON.parse(errorText) as { error?: { message?: string } }
      if (errorJson.error?.message) {
        errorMessage = errorJson.error.message
      }
    } catch {
      if (errorText) errorMessage += `: ${errorText.slice(0, 200)}`
    }
    throw new Error(errorMessage)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('无法读取响应流')

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        const content = config.parseStream(trimmed)
        if (content) yield content
      }
    }

    // Process remaining buffer
    if (buffer.trim()) {
      const content = config.parseStream(buffer.trim())
      if (content) yield content
    }
  } finally {
    reader.releaseLock()
  }
}

export const PROVIDER_LABELS: Record<AIProvider, string> = {
  openai: 'OpenAI (GPT-4o-mini)',
  deepseek: 'DeepSeek',
  claude: 'Claude (需CORS代理)',
}
