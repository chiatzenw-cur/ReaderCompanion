import { ipcMain, dialog, app, BrowserWindow, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1e3,
    minHeight: 600,
    show: false,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    frame: true,
    autoHideMenuBar: true,
    // Hide menu bar
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    }
  });
  win.once("ready-to-show", () => {
    win == null ? void 0 : win.show();
    if (process.env.NODE_ENV === "development") {
      win == null ? void 0 : win.webContents.openDevTools();
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
ipcMain.handle("select-pdf-file", async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ["openFile"],
    filters: [
      { name: "PDF Files", extensions: ["pdf"] },
      { name: "All Files", extensions: ["*"] }
    ]
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const fileBuffer = fs.readFileSync(filePath);
    return {
      path: filePath,
      name: path.basename(filePath),
      buffer: Array.from(new Uint8Array(fileBuffer))
    };
  }
  return null;
});
ipcMain.handle("save-config", async (_, config) => {
  try {
    const configPath = path.join(app.getPath("userData"), "config.json");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error("Failed to save config:", error);
    return false;
  }
});
ipcMain.handle("load-config", async () => {
  try {
    const configPath = path.join(app.getPath("userData"), "config.json");
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, "utf-8");
      return JSON.parse(configData);
    }
  } catch (error) {
    console.error("Failed to load config:", error);
  }
  return null;
});
function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Open PDF...",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            win == null ? void 0 : win.webContents.send("menu-open-pdf");
          }
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectAll" }
      ]
    },
    {
      label: "View",
      submenu: [
        { label: "Reload", accelerator: "CmdOrCtrl+R", role: "reload" },
        { label: "Toggle Developer Tools", accelerator: "F12", role: "toggleDevTools" },
        { type: "separator" },
        { label: "Actual Size", accelerator: "CmdOrCtrl+0", role: "resetZoom" },
        { label: "Zoom In", accelerator: "CmdOrCtrl+Plus", role: "zoomIn" },
        { label: "Zoom Out", accelerator: "CmdOrCtrl+-", role: "zoomOut" }
      ]
    }
  ];
  if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [
        { label: "About Reader Companion", role: "about" },
        { type: "separator" },
        { label: "Hide Reader Companion", accelerator: "Command+H", role: "hide" },
        { label: "Hide Others", accelerator: "Command+Shift+H", role: "hideOthers" },
        { label: "Show All", role: "unhide" },
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: () => app.quit() }
      ]
    });
  }
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  createMenu();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
