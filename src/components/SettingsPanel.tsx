import { useState, useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import { testAIConnection, getAvailableModels } from '../services/aiService'
import { X, Check, AlertCircle, Loader2, Moon, Sun, Monitor } from 'lucide-react'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { config, updateConfig } = useApp()
  const [formData, setFormData] = useState(config)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionTest, setConnectionTest] = useState<{ success: boolean; error?: string } | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isAutoSaved, setIsAutoSaved] = useState(false)

  useEffect(() => {
    setFormData(config)
  }, [config])

  // Auto-save API configuration changes
  useEffect(() => {
    const autoSaveTimer = setTimeout(async () => {
      const hasApiKeyChange = formData.aiProvider.apiKey !== config.aiProvider.apiKey
      const hasModelChange = formData.aiProvider.model !== config.aiProvider.model
      const hasProviderChange = formData.aiProvider.name !== config.aiProvider.name
      const hasBaseUrlChange = formData.aiProvider.baseURL !== config.aiProvider.baseURL
      
      if (hasApiKeyChange || hasModelChange || hasProviderChange || hasBaseUrlChange) {
        try {
          await updateConfig({ aiProvider: formData.aiProvider })
          setIsAutoSaved(true)
          setTimeout(() => setIsAutoSaved(false), 2000)
        } catch (error) {
          console.error('Auto-save failed:', error)
        }
      }
    }, 1500) // Auto-save after 1.5 seconds of no changes

    return () => clearTimeout(autoSaveTimer)
  }, [formData.aiProvider, config.aiProvider, updateConfig])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      console.log('Saving config:', { 
        hasApiKey: !!formData.aiProvider.apiKey, 
        provider: formData.aiProvider.name 
      })
      await updateConfig(formData)
      console.log('Config saved successfully')
      setTimeout(() => {
        setIsSaving(false)
        onClose()
      }, 500)
    } catch (error) {
      console.error('Failed to save config:', error)
      setIsSaving(false)
    }
  }

  const handleTestConnection = async () => {
    if (!formData.aiProvider.apiKey) {
      setConnectionTest({ success: false, error: 'Please enter an API key first' })
      return
    }

    setIsTestingConnection(true)
    setConnectionTest(null)

    try {
      const result = await testAIConnection(formData.aiProvider)
      setConnectionTest(result)
      
      // If test successful, auto-save the working configuration
      if (result.success) {
        await updateConfig({ aiProvider: formData.aiProvider })
        setIsAutoSaved(true)
        setTimeout(() => setIsAutoSaved(false), 3000)
      }
    } catch (error) {
      setConnectionTest({ success: false, error: 'Connection test failed' })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const availableModels = getAvailableModels(formData.aiProvider.name)


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            设置
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-8">
            {/* AI Provider Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                AI 提供商设置
              </h3>
              
              {/* Provider Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AI 提供商
                  </label>
                  <select
                    value={formData.aiProvider.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      aiProvider: {
                        ...formData.aiProvider,
                        name: e.target.value as 'openai' | 'deepseek',
                        model: getAvailableModels(e.target.value as 'openai' | 'deepseek')[0]
                      }
                    })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="deepseek">DeepSeek</option>
                  </select>
                </div>

                {/* API Key */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      API 密钥
                    </label>
                    {isAutoSaved && (
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <Check size={14} />
                        <span className="text-xs">已自动保存</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="password"
                    value={formData.aiProvider.apiKey}
                    onChange={(e) => setFormData({
                      ...formData,
                      aiProvider: { ...formData.aiProvider, apiKey: e.target.value }
                    })}
                    placeholder="输入您的 API 密钥"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    API密钥和模型选择会自动保存
                  </p>
                </div>

                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    模型
                  </label>
                  <select
                    value={formData.aiProvider.model}
                    onChange={(e) => setFormData({
                      ...formData,
                      aiProvider: { ...formData.aiProvider, model: e.target.value }
                    })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                  >
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Base URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    自定义 API 端点 (可选)
                  </label>
                  <input
                    type="url"
                    value={formData.aiProvider.baseURL || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      aiProvider: { ...formData.aiProvider, baseURL: e.target.value }
                    })}
                    placeholder={formData.aiProvider.name === 'openai' ? 'https://api.openai.com/v1' : 'https://api.deepseek.com/v1'}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  />
                </div>

                {/* Test Connection */}
                <div>
                  <button
                    onClick={handleTestConnection}
                    disabled={isTestingConnection || !formData.aiProvider.apiKey}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-md transition-colors disabled:cursor-not-allowed"
                  >
                    {isTestingConnection ? <Loader2 size={16} className="animate-spin" /> : null}
                    <span>{isTestingConnection ? '测试中...' : '测试连接'}</span>
                  </button>
                  
                  {connectionTest && (
                    <div className={`mt-2 p-3 rounded-md flex items-center space-x-2 ${
                      connectionTest.success 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    }`}>
                      {connectionTest.success ? <Check size={16} /> : <AlertCircle size={16} />}
                      <span className="text-sm">
                        {connectionTest.success ? '连接成功！' : `连接失败: ${connectionTest.error}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Theme Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                外观设置
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    主题
                  </label>
                  <div className="flex space-x-2">
                    {(['light', 'dark', 'system'] as const).map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => setFormData({ ...formData, theme: themeOption })}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-colors ${
                          formData.theme === themeOption
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {themeOption === 'light' && <Sun size={16} />}
                        {themeOption === 'dark' && <Moon size={16} />}
                        {themeOption === 'system' && <Monitor size={16} />}
                        <span className="capitalize">
                          {themeOption === 'light' && '浅色'}
                          {themeOption === 'dark' && '深色'}
                          {themeOption === 'system' && '跟随系统'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    语言
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({
                      ...formData,
                      language: e.target.value as 'en' | 'zh' | 'auto'
                    })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                  >
                    <option value="auto">自动检测</option>
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                系统提示词
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  自定义 AI 助手的行为和回答风格
                </label>
                <textarea
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  rows={8}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 text-sm"
                  placeholder="输入系统提示词..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  系统提示词将告诉 AI 如何分析和回答关于 PDF 内容的问题
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-md transition-colors disabled:cursor-not-allowed"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            <span>{isSaving ? '保存中...' : '保存'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}