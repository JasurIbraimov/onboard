import { BrowserWindow, app } from "electron";
import path from "path";
import { isDev } from "./utils/common-utils.js";

app.on('ready', () => {
    const mainWindow = new BrowserWindow({});

    if(isDev()) {
        mainWindow.loadURL("http://localhost:" + 5173);
    } else {
        const appPathName = path.join(app.getAppPath(), "dist-react", "index.html")
        mainWindow.loadFile(appPathName);
    }
    
})