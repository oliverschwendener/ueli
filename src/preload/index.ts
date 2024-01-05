import type { ContextBridge } from "@common/ContextBridge";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ContextBridge", <ContextBridge>{
    extensionDisabled: (extensionId: string) => ipcRenderer.send("extensionDisabled", { extensionId }),
    extensionEnabled: (extensionId: string) => ipcRenderer.send("extensionEnabled", { extensionId }),
    getAboutUeli: () => ipcRenderer.sendSync("getAboutUeli"),
    getLogs: () => ipcRenderer.sendSync("getLogs"),
    getSearchResultItems: () => ipcRenderer.sendSync("getSearchResultItems"),
    getSettingByKey: <T>(key: string, defaultValue: T): T =>
        ipcRenderer.sendSync("getSettingByKey", { key, defaultValue }),
    getAvailableExtensions: () => ipcRenderer.sendSync("getAvailableExtensions"),
    getExtensionSettingsStructure: (extensionId) =>
        ipcRenderer.sendSync("getExtensionSettingsStructure", { extensionId }),
    getOperatingSystem: () => ipcRenderer.sendSync("getOperatingSystem"),
    invokeAction: (action) => ipcRenderer.invoke("invokeAction", { action }),
    onNativeThemeChanged: (callback) => ipcRenderer.on("nativeThemeChanged", callback),
    onSearchIndexUpdated: (callback) => ipcRenderer.on("searchIndexUpdated", callback),
    onOpenSettings: (callback) => ipcRenderer.on("openSettings", callback),
    onOpenAbout: (callback) => ipcRenderer.on("openAbout", callback),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
    updateSettingByKey: <T>(key: string, value: T) => ipcRenderer.invoke("updateSettingByKey", { key, value }),
    windowFocused: (callback) => ipcRenderer.on("windowFocused", callback),
});
