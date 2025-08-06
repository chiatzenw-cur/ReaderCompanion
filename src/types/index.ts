export interface PDFFile {
  path: string
  name: string
  buffer: Uint8Array
}

export interface TextSelection {
  text: string
  pageNumber: number
  boundingRect?: DOMRect
  timestamp: number
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: number
  selection?: TextSelection
}

export interface AIProvider {
  name: 'openai' | 'deepseek'
  apiKey: string
  model: string
  baseURL?: string
}

export interface AppConfig {
  aiProvider: AIProvider
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'zh' | 'auto'
  systemPrompt: string
}

export interface ChatContextValue {
  messages: ChatMessage[]
  isLoading: boolean
  sendMessage: (content: string, selection?: TextSelection) => Promise<void>
  clearMessages: () => void
  regenerateLastMessage: () => Promise<void>
}

export interface PDFContextValue {
  currentFile: PDFFile | null
  loadPDF: (file: PDFFile) => void
  currentSelection: TextSelection | null
  setCurrentSelection: (selection: TextSelection | null) => void
}