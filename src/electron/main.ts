// main.ts
import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./utils/common-utils.js";


let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    }
  });
  if (isDev()) {
    // Vite dev server
    mainWindow.loadURL("http://localhost:5173");
  } else {
    // Production build
    mainWindow.loadFile(path.join(process.cwd(), "dist-react/index.html"));
  }

}

// Создание главного окна после готовности приложения
app.whenReady().then(createMainWindow);

