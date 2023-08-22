import { ContextBridge } from "@common/ContextBridge";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ContextBridge", <ContextBridge>{
    getSearchResultItems: () => ipcRenderer.sendSync("getSearchResultItems"),
    onNativeThemeChanged: (callback) => ipcRenderer.on("nativeThemeChanged", callback),
    onSearchIndexUpdated: (callback) => ipcRenderer.on("searchIndexUpdated", callback),
    getSettingByKey: <T>(key: string, defaultValue: T): T =>
        ipcRenderer.sendSync("getSettingByKey", { key, defaultValue }),
    updateSettingByKey: <T>(key: string, value: T) => ipcRenderer.invoke("updateSettingByKey", { key, value }),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
});
