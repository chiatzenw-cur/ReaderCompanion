"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  selectPdfFile: () => electron.ipcRenderer.invoke("select-pdf-file"),
  saveConfig: (config) => electron.ipcRenderer.invoke("save-config", config),
  loadConfig: () => electron.ipcRenderer.invoke("load-config"),
  onMenuOpenPdf: (callback) => {
    electron.ipcRenderer.on("menu-open-pdf", callback);
  },
  removeAllListeners: (channel) => {
    electron.ipcRenderer.removeAllListeners(channel);
  }
});
