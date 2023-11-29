import type { ContextBridge } from "@common/ContextBridge";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ContextBridge", <ContextBridge>{
    getSupportedExtensions: () => ipcRenderer.sendSync("getSupportedExtensions"),
    extensionDisabled: (extensionId: string) => ipcRenderer.send("extensionDisabled", { extensionId }),
    extensionEnabled: (extensionId: string) => ipcRenderer.send("extensionEnabled", { extensionId }),
    getSearchResultItems: () => ipcRenderer.sendSync("getSearchResultItems"),
    getSettingByKey: <T>(key: string, defaultValue: T): T =>
        ipcRenderer.sendSync("getSettingByKey", { key, defaultValue }),
    invokeAction: (action) => ipcRenderer.invoke("invokeAction", { action }),
    onNativeThemeChanged: (callback) => ipcRenderer.on("nativeThemeChanged", callback),
    onSearchIndexUpdated: (callback) => ipcRenderer.on("searchIndexUpdated", callback),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
    updateSettingByKey: <T>(key: string, value: T) => ipcRenderer.invoke("updateSettingByKey", { key, value }),
    windowFocused: (callback) => ipcRenderer.on("windowFocused", callback),
});
