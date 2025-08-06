import React, { useState, useRef, useEffect } from 'react'
import { useChat } from '../contexts/ChatContext'
import { usePDF } from '../contexts/PDFContext'
import { useTranslation } from '../i18n/useTranslation'
import { MessageBubble } from './MessageBubble'
import { Copy, Send, RotateCcw, Trash2, Settings } from 'lucide-react'

interface ChatPanelProps {
  onOpenSettings?: () => void
}

export function ChatPanel({ onOpenSettings }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('')
  const { messages, isLoading, sendMessage, clearMessages, regenerateLastMessage } = useChat()
  const { currentSelection } = usePDF()
  const { t } = useTranslation()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [inputValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim() || isLoading) return

    const message = inputValue.trim()
    setInputValue('')
    
    await sendMessage(message, currentSelection || undefined)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleExportChat = async () => {
    if (messages.length === 0) return

    const chatContent = messages
      .map(msg => {
        const time = new Date(msg.timestamp).toLocaleString()
        const role = msg.type === 'user' ? t.user : t.assistant
        let content = `**${role}** (${time})\n\n${msg.content}`
        
        if (msg.selection) {
          content += `\n\n> **${t.selectedTextPrefix}** (${t.page} ${msg.selection.pageNumber}):\n> ${msg.selection.text.replace(/\n/g, '\n> ')}`
        }
        
        return content
      })
      .join('\n\n---\n\n')

    const header = `# ${t.chatExportTitle}\n\n**${t.exportTime}**: ${new Date().toLocaleString()}\n**${t.messageCount}**: ${messages.length}\n\n---\n\n`
    const fullContent = header + chatContent

    const blob = new Blob([fullContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reader-companion-chat-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyAllMessages = async () => {
    const chatText = messages
      .map(msg => {
        const time = new Date(msg.timestamp).toLocaleString()
        const role = msg.type === 'user' ? t.user : t.assistant
        let content = `${role} (${time}):\n${msg.content}`
        
        // Include selected text if present
        if (msg.selection) {
          content += `\n\n[${t.selectedTextPrefix} - ${t.page}${msg.selection.pageNumber}]:\n"${msg.selection.text}"`
        }
        
        return content
      })
      .join('\n\n' + '='.repeat(50) + '\n\n')

    try {
      await navigator.clipboard.writeText(chatText)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t.aiAssistant}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              title={t.settings}
            >
              <Settings size={18} />
            </button>
            <button
              onClick={copyAllMessages}
              disabled={messages.length === 0}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title={t.copyAllChats}
            >
              <Copy size={18} />
            </button>
            <button
              onClick={handleExportChat}
              disabled={messages.length === 0}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title={t.exportChat}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button
              onClick={clearMessages}
              disabled={messages.length === 0}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
              title={t.clearChat}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {currentSelection && (
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
              {t.selectedText} ({t.page} {currentSelection.pageNumber}):
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {currentSelection.text}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            </div>
            <p className="text-sm">
              {t.emptyState}
            </p>
            <p className="text-xs mt-1">
              {t.emptyStateHint}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">{t.aiThinking}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Regenerate button */}
      {messages.length > 0 && messages[messages.length - 1].type === 'assistant' && (
        <div className="px-4 pb-2">
          <button
            onClick={regenerateLastMessage}
            disabled={isLoading}
            className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={14} />
            <span>{t.regenerate}</span>
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.inputPlaceholder}
              rows={1}
              className="w-full resize-none rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 max-h-32"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-md transition-colors disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </form>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {t.inputHint}
        </div>
      </div>
    </div>
  )
}