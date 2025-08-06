export interface ElectronAPI {
  selectPdfFile: () => Promise<{ path: string; name: string; buffer: number[] } | null>
  saveConfig: (config: any) => Promise<boolean>
  loadConfig: () => Promise<any>
  onMenuOpenPdf: (callback: () => void) => void
  removeAllListeners: (channel: string) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}