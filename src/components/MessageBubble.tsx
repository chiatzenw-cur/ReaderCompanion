import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ChatMessage } from '../types'
import { Copy, Check, User, Bot } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { theme } = useApp()

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isUser = message.type === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-green-500 text-white'
          }`}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Header with time */}
          <div className={`flex items-center mb-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.timestamp)}
            </span>
            <button
              onClick={() => copyToClipboard(message.content)}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${
                isUser ? 'mr-2' : 'ml-2'
              }`}
              title="复制消息"
            >
              {isCopied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>

          {/* Selection context if present */}
          {message.selection && (
            <div className={`mb-2 p-2 text-xs bg-gray-50 dark:bg-gray-700 rounded border-l-2 border-blue-400 ${
              isUser ? 'text-right' : 'text-left'
            }`}>
              <div className="text-gray-500 dark:text-gray-400 mb-1">
                选中文本 (第 {message.selection.pageNumber} 页):
              </div>
              <div className="text-gray-700 dark:text-gray-300 italic">
                "{message.selection.text}"
              </div>
            </div>
          )}

          {/* Message bubble */}
          <div className={`rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
          }`}>
            {isUser ? (
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    code({ node, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      return match ? (
                        <SyntaxHighlighter
                          style={theme === 'dark' ? oneDark : oneLight as any}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md"
                          customStyle={{
                            margin: 0,
                            fontSize: '0.875rem'
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code 
                          className={`${className} bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded text-sm`} 
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    },
                    p({ children }) {
                      return <p className="mb-2 last:mb-0">{children}</p>
                    },
                    ul({ children }) {
                      return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                    },
                    ol({ children }) {
                      return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                    },
                    h1({ children }) {
                      return <h1 className="text-lg font-bold mb-2">{children}</h1>
                    },
                    h2({ children }) {
                      return <h2 className="text-md font-bold mb-2">{children}</h2>
                    },
                    h3({ children }) {
                      return <h3 className="text-sm font-bold mb-2">{children}</h3>
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-2">
                          {children}
                        </blockquote>
                      )
                    },
                    table({ children }) {
                      return (
                        <div className="overflow-x-auto mb-2">
                          <table className="min-w-full border border-gray-300 dark:border-gray-600">
                            {children}
                          </table>
                        </div>
                      )
                    },
                    th({ children }) {
                      return (
                        <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 bg-gray-50 dark:bg-gray-800 font-semibold text-left">
                          {children}
                        </th>
                      )
                    },
                    td({ children }) {
                      return (
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                          {children}
                        </td>
                      )
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}