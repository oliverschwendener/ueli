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
    showOpenDialog: (options) => ipcRenderer.invoke("showOpenDialog", { options }),
    onNativeThemeChanged: (callback) => ipcRenderer.on("nativeThemeChanged", callback),
    onSearchIndexUpdated: (callback) => ipcRenderer.on("searchIndexUpdated", callback),
    onNavigateTo: (callback: (pathname: string) => void) =>
        ipcRenderer.on("navigateTo", (_, { pathname }: { pathname: string }) => callback(pathname)),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
    updateSettingByKey: <T>(key: string, value: T) => ipcRenderer.invoke("updateSettingByKey", { key, value }),
    windowFocused: (callback) => ipcRenderer.on("windowFocused", callback),
});
