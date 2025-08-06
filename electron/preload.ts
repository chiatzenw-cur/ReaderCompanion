import { ipcRenderer, contextBridge } from 'electron'

export interface ElectronAPI {
  selectPdfFile: () => Promise<{ path: string; name: string; buffer: number[] } | null>
  saveConfig: (config: any) => Promise<boolean>
  loadConfig: () => Promise<any>
  onMenuOpenPdf: (callback: () => void) => void
  removeAllListeners: (channel: string) => void
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  selectPdfFile: () => ipcRenderer.invoke('select-pdf-file'),
  saveConfig: (config: any) => ipcRenderer.invoke('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  onMenuOpenPdf: (callback: () => void) => {
    ipcRenderer.on('menu-open-pdf', callback)
  },
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  }
} as ElectronAPI)
