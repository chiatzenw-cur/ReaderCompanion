import { useState, useEffect } from 'react'
import { PDFProvider } from './contexts/PDFContext'
import { ChatProvider } from './contexts/ChatContext'
import { PDFViewer } from './components/PDFViewer'
import { ChatPanel } from './components/ChatPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { usePDF } from './contexts/PDFContext'
import { useApp } from './contexts/AppContext'
import { useTranslation } from './i18n/useTranslation'
import { Menu, FileText, Moon, Sun, Languages } from 'lucide-react'

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { loadPDF } = usePDF()
  const { theme, toggleTheme, updateConfig } = useApp()
  const { t, currentLanguage } = useTranslation()

  // Handle file opening from main process
  useEffect(() => {
    if (window.electronAPI) {
      const handleMenuOpenPdf = async () => {
        const file = await window.electronAPI.selectPdfFile()
        if (file) {
          const pdfFile = {
            ...file,
            buffer: new Uint8Array(file.buffer)
          }
          loadPDF(pdfFile)
        }
      }

      window.electronAPI.onMenuOpenPdf(handleMenuOpenPdf)

      return () => {
        window.electronAPI.removeAllListeners('menu-open-pdf')
      }
    }
  }, [loadPDF])

  const handleOpenPDF = async () => {
    if (window.electronAPI) {
      const file = await window.electronAPI.selectPdfFile()
      if (file) {
        const pdfFile = {
          ...file,
          buffer: new Uint8Array(file.buffer)
        }
        loadPDF(pdfFile)
      }
    }
    setIsMenuOpen(false)
  }

  const toggleLanguage = () => {
    const nextLanguage = currentLanguage === 'zh' ? 'en' : 'zh'
    updateConfig({ language: nextLanguage })
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <Menu size={16} />
            </button>
            
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                <button
                  onClick={handleOpenPDF}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FileText size={16} />
                  <span>{t.openPDF}</span>
                  <span className="ml-auto text-xs text-gray-400">Ctrl+O</span>
                </button>
              </div>
            )}
          </div>
          
          <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Reader Companion
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center space-x-1"
            title={currentLanguage === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            <Languages size={14} />
            <span className="text-xs font-medium">{currentLanguage === 'zh' ? 'EN' : '中'}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            title={currentLanguage === 'zh' ? '切换主题' : 'Toggle theme'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-3rem)]">
        {/* PDF Viewer */}
        <PDFViewer />
        
        {/* Chat Panel */}
        <ChatPanel onOpenSettings={() => setIsSettingsOpen(true)} />
      </div>

      {/* Settings Modal */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <PDFProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </PDFProvider>
  )
}

export default App
