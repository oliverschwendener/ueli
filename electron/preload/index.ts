import { ContextBridge } from "@common/ContextBridge";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ContextBridge", <ContextBridge>{
    getSearchResultItems: () => ipcRenderer.sendSync("getSearchResultItems"),
    onNativeThemeChanged: (callback: () => void) => ipcRenderer.on("nativeThemeChanged", callback),
    onSearchIndexUpdated: (callback: () => void) => ipcRenderer.on("searchIndexUpdated", callback),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
});
