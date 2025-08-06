import { AIProvider, ChatMessage } from '../types'

interface AIRequestParams {
  prompt: string
  systemPrompt: string
  conversationHistory: ChatMessage[]
  provider: AIProvider
}

export async function sendAIRequest({
  prompt,
  systemPrompt,
  conversationHistory,
  provider
}: AIRequestParams): Promise<string> {
  const { name, apiKey, model, baseURL } = provider

  console.log('AI Request - Provider:', { name, hasApiKey: !!apiKey, model, baseURL })

  if (!apiKey || apiKey.trim() === '') {
    console.error('API Key missing or empty:', { apiKey: apiKey ? '[HIDDEN]' : 'null', provider })
    throw new Error('API密钥未配置，请在设置中添加API密钥')
  }

  // Prepare messages for the API
  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },
    // Add conversation history
    ...conversationHistory.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    })),
    // Add current prompt
    {
      role: 'user',
      content: prompt
    }
  ]

  try {
    let response: Response

    if (name === 'openai') {
      response = await fetch(baseURL || 'https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-3.5-turbo',
          messages,
          temperature: 0.7,
          max_tokens: 2048
        })
      })
    } else if (name === 'deepseek') {
      response = await fetch(baseURL || 'https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 2048,
          stream: false
        })
      })
    } else {
      throw new Error(`不支持的AI提供商: ${name}`)
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(`AI API请求失败: ${response.status} - ${errorData.error?.message || errorData.error || '未知错误'}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('AI API返回数据格式错误')
    }

    return data.choices[0].message.content.trim()

  } catch (error) {
    console.error('AI request failed:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error(`网络请求失败: ${error}`)
  }
}

// Test API connection
export async function testAIConnection(provider: AIProvider): Promise<{ success: boolean; error?: string }> {
  try {
    const testResponse = await sendAIRequest({
      prompt: '请回复"测试成功"',
      systemPrompt: '你是一个AI助手，用于测试API连接。',
      conversationHistory: [],
      provider
    })

    if (testResponse.includes('测试成功') || testResponse.length > 0) {
      return { success: true }
    } else {
      return { success: false, error: 'API连接测试失败：返回内容异常' }
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '未知错误' 
    }
  }
}

// Get available models for each provider
export function getAvailableModels(providerName: 'openai' | 'deepseek'): string[] {
  switch (providerName) {
    case 'openai':
      return [
        'gpt-4',
        'gpt-4-turbo',
        'gpt-3.5-turbo',
        'gpt-3.5-turbo-16k'
      ]
    case 'deepseek':
      return [
        'deepseek-chat',
        'deepseek-coder'
      ]
    default:
      return []
  }
}

// Helper function to estimate token count (rough estimation)
export function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English, 1 token ≈ 1.5 characters for Chinese
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0
  const otherChars = text.length - chineseChars
  
  return Math.ceil(chineseChars / 1.5 + otherChars / 4)
}

// Helper function to truncate conversation history if it gets too long
export function truncateConversationHistory(messages: ChatMessage[], maxTokens: number = 3000): ChatMessage[] {
  let totalTokens = 0
  const result: ChatMessage[] = []
  
  // Process messages in reverse order (keep recent messages)
  for (let i = messages.length - 1; i >= 0; i--) {
    const messageTokens = estimateTokenCount(messages[i].content)
    
    if (totalTokens + messageTokens > maxTokens) {
      break
    }
    
    totalTokens += messageTokens
    result.unshift(messages[i])
  }
  
  return result
}