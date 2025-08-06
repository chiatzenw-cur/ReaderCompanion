import React, { createContext, useContext, useEffect, useState } from 'react'
import { AppConfig } from '../types'

interface AppContextType {
  config: AppConfig
  updateConfig: (updates: Partial<AppConfig>) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const defaultConfig: AppConfig = {
  aiProvider: {
    name: 'openai',
    apiKey: '',
    model: 'gpt-3.5-turbo',
  },
  theme: 'system',
  language: 'auto',
  systemPrompt: `你是一个专业的AI助手，专门帮助用户理解和分析PDF文档内容。当用户选中PDF中的文本时，请根据以下指导原则回答：

1. 如果是技术文档：提供技术解释、相关概念、最佳实践
2. 如果是学术论文：解释关键概念、理论背景、研究意义
3. 如果是商业文档：分析要点、潜在影响、建议行动
4. 如果是法律文档：解释条款含义、潜在风险、注意事项

请用简洁明了的语言回答，必要时提供示例。回答应该准确、有用，并且与选中的文本内容高度相关。`
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(defaultConfig)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Load config on startup
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.loadConfig().then((savedConfig) => {
        if (savedConfig) {
          setConfig({ ...defaultConfig, ...savedConfig })
        }
      })
    }
  }, [])

  // Apply theme
  useEffect(() => {
    
    if (config.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setTheme(systemTheme)
    } else {
      setTheme(config.theme)
    }
  }, [config.theme])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const updateConfig = async (updates: Partial<AppConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    
    if (window.electronAPI) {
      await window.electronAPI.saveConfig(newConfig)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    updateConfig({ theme: newTheme })
  }

  return (
    <AppContext.Provider value={{
      config,
      updateConfig,
      theme,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}