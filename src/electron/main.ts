import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// путь к текущему файлу
const __filename = fileURLToPath(import.meta.url);

// путь к папке с файлом
const __dirname = path.dirname(__filename);
let mainWindow: BrowserWindow;



app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "../dist-react/index.html"));
});

// обработчик генерации документа
ipcMain.handle("generate-doc", async (event, data: any) => {
  console.log("Data from renderer:", data);
  // здесь логика генерации DOCX
  const outputPath = "C:\\Users\\jibraimov\\Desktop\\Projects\\Onboard\\src"; // пример
  return outputPath;
});
