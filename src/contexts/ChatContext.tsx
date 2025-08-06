import React, { createContext, useContext, useState, useCallback } from 'react'
import { ChatMessage, TextSelection, ChatContextValue } from '../types'
import { useApp } from './AppContext'
import { sendAIRequest } from '../services/aiService'

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { config } = useApp()

  const sendMessage = useCallback(async (content: string, selection?: TextSelection) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: Date.now(),
      selection
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Prepare context from previous messages
      const conversationHistory = messages.slice(-6) // Keep last 6 messages for context
      
      // Prepare prompt with selection context
      let prompt = content
      if (selection) {
        prompt = `基于PDF中选中的文本："${selection.text}"，${content}`
      }

      console.log('Sending AI request with config:', { 
        hasApiKey: !!config.aiProvider.apiKey, 
        provider: config.aiProvider.name 
      })
      
      const aiResponse = await sendAIRequest({
        prompt,
        systemPrompt: config.systemPrompt,
        conversationHistory,
        provider: config.aiProvider
      })

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '抱歉，发生了错误。请检查您的API配置或网络连接。',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages, config])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const regenerateLastMessage = useCallback(async () => {
    if (messages.length < 2) return

    const lastUserMessage = messages[messages.length - 2]
    if (lastUserMessage.type !== 'user') return

    // Remove the last assistant message
    setMessages(prev => prev.slice(0, -1))
    
    // Resend the last user message
    await sendMessage(lastUserMessage.content, lastUserMessage.selection)
  }, [messages, sendMessage])

  return (
    <ChatContext.Provider value={{
      messages,
      isLoading,
      sendMessage,
      clearMessages,
      regenerateLastMessage
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}