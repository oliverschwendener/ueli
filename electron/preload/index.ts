import { contextBridge, ipcRenderer } from "electron";
import { ContextBridge } from "./ContextBridge";

contextBridge.exposeInMainWorld("ContextBridge", <ContextBridge>{
    onNativeThemeChanged: (callback: () => void) => ipcRenderer.on("nativeThemeChanged", callback),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
    settingsOpenStateChanged: (data) => ipcRenderer.send("settingsOpenStateChanged", data),
});
