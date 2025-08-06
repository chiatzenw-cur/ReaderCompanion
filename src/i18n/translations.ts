export interface Translations {
  // Common
  save: string
  cancel: string
  loading: string
  error: string
  success: string
  
  // Header
  openPDF: string
  settings: string
  
  // Chat Panel
  aiAssistant: string
  selectedText: string
  page: string
  copyAllChats: string
  exportChat: string
  clearChat: string
  regenerate: string
  inputPlaceholder: string
  inputHint: string
  emptyState: string
  emptyStateHint: string
  aiThinking: string
  
  // Settings Panel
  settingsTitle: string
  aiProviderSettings: string
  aiProvider: string
  apiKey: string
  model: string
  customEndpoint: string
  testConnection: string
  testingConnection: string
  connectionSuccess: string
  connectionFailed: string
  autoSaved: string
  appearanceSettings: string
  theme: string
  themeLight: string
  themeDark: string
  themeSystem: string
  language: string
  languageAuto: string
  languageChinese: string
  languageEnglish: string
  systemPrompt: string
  systemPromptDescription: string
  systemPromptHint: string
  apiKeyHint: string
  saving: string
  
  // PDF Viewer
  selectTextToStart: string
  ocrProcessing: string
  
  // Export
  chatExportTitle: string
  exportTime: string
  messageCount: string
  user: string
  assistant: string
  selectedTextPrefix: string
}

export const translations: Record<string, Translations> = {
  zh: {
    // Common
    save: '保存',
    cancel: '取消',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    
    // Header
    openPDF: '打开PDF',
    settings: '设置',
    
    // Chat Panel
    aiAssistant: 'AI 助手',
    selectedText: '已选中文本',
    page: '页',
    copyAllChats: '复制全部对话',
    exportChat: '导出对话',
    clearChat: '清空对话',
    regenerate: '重新生成',
    inputPlaceholder: '输入消息或问题...',
    inputHint: '按 Enter 发送，Shift+Enter 换行',
    emptyState: '选择PDF中的文本开始对话',
    emptyStateHint: '或者直接输入问题',
    aiThinking: 'AI正在思考...',
    
    // Settings Panel
    settingsTitle: '设置',
    aiProviderSettings: 'AI 提供商设置',
    aiProvider: 'AI 提供商',
    apiKey: 'API 密钥',
    model: '模型',
    customEndpoint: '自定义 API 端点 (可选)',
    testConnection: '测试连接',
    testingConnection: '测试中...',
    connectionSuccess: '连接成功！',
    connectionFailed: '连接失败',
    autoSaved: '已自动保存',
    appearanceSettings: '外观设置',
    theme: '主题',
    themeLight: '浅色',
    themeDark: '深色',
    themeSystem: '跟随系统',
    language: '语言',
    languageAuto: '自动检测',
    languageChinese: '中文',
    languageEnglish: 'English',
    systemPrompt: '系统提示词',
    systemPromptDescription: '自定义 AI 助手的行为和回答风格',
    systemPromptHint: '系统提示词将告诉 AI 如何分析和回答关于 PDF 内容的问题',
    apiKeyHint: 'API密钥和模型选择会自动保存',
    saving: '保存中...',
    
    // PDF Viewer
    selectTextToStart: '选择文本开始分析',
    ocrProcessing: '正在识别文字...',
    
    // Export
    chatExportTitle: 'PDF阅读对话记录',
    exportTime: '导出时间',
    messageCount: '消息数量',
    user: '用户',
    assistant: 'AI助手',
    selectedTextPrefix: '选中文本'
  },
  
  en: {
    // Common
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Header
    openPDF: 'Open PDF',
    settings: 'Settings',
    
    // Chat Panel
    aiAssistant: 'AI Assistant',
    selectedText: 'Selected Text',
    page: 'Page',
    copyAllChats: 'Copy All Chats',
    exportChat: 'Export Chat',
    clearChat: 'Clear Chat',
    regenerate: 'Regenerate',
    inputPlaceholder: 'Enter message or question...',
    inputHint: 'Press Enter to send, Shift+Enter for new line',
    emptyState: 'Select text in PDF to start conversation',
    emptyStateHint: 'Or enter a question directly',
    aiThinking: 'AI is thinking...',
    
    // Settings Panel
    settingsTitle: 'Settings',
    aiProviderSettings: 'AI Provider Settings',
    aiProvider: 'AI Provider',
    apiKey: 'API Key',
    model: 'Model',
    customEndpoint: 'Custom API Endpoint (Optional)',
    testConnection: 'Test Connection',
    testingConnection: 'Testing...',
    connectionSuccess: 'Connection successful!',
    connectionFailed: 'Connection failed',
    autoSaved: 'Auto-saved',
    appearanceSettings: 'Appearance Settings',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'Follow System',
    language: 'Language',
    languageAuto: 'Auto Detect',
    languageChinese: '中文',
    languageEnglish: 'English',
    systemPrompt: 'System Prompt',
    systemPromptDescription: 'Customize AI assistant behavior and response style',
    systemPromptHint: 'System prompt tells AI how to analyze and answer questions about PDF content',
    apiKeyHint: 'API key and model selection will be auto-saved',
    saving: 'Saving...',
    
    // PDF Viewer
    selectTextToStart: 'Select text to start analysis',
    ocrProcessing: 'Processing OCR...',
    
    // Export
    chatExportTitle: 'PDF Reader Chat History',
    exportTime: 'Export Time',
    messageCount: 'Message Count',
    user: 'User',
    assistant: 'AI Assistant',
    selectedTextPrefix: 'Selected Text'
  }
}