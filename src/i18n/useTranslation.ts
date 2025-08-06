import { useApp } from '../contexts/AppContext'
import { translations } from './translations'

export function useTranslation() {
  const { config } = useApp()
  
  const getCurrentLanguage = (): string => {
    if (config.language === 'auto') {
      // Auto-detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('zh')) {
        return 'zh'
      }
      return 'en'
    }
    return config.language
  }
  
  const currentLang = getCurrentLanguage()
  const t = translations[currentLang] || translations.en
  
  return { t, currentLanguage: currentLang }
}