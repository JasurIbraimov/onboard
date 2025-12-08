import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    generateDoc: (data: any) => ipcRenderer.invoke("generate-doc", data),
});
