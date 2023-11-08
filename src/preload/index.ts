import type { ContextBridge } from "@common/ContextBridge";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ContextBridge", <ContextBridge>{
    getSupportedPlugins: () => ipcRenderer.sendSync("getSupportedPlugins"),
    pluginDisabled: (pluginId: string) => ipcRenderer.send("pluginDisabled", { pluginId }),
    pluginEnabled: (pluginId: string) => ipcRenderer.send("pluginEnabled", { pluginId }),
    getSearchResultItems: () => ipcRenderer.sendSync("getSearchResultItems"),
    getSettingByKey: <T>(key: string, defaultValue: T): T =>
        ipcRenderer.sendSync("getSettingByKey", { key, defaultValue }),
    invokeExecution: (executionArgument) => ipcRenderer.invoke("invokeExecution", executionArgument),
    onNativeThemeChanged: (callback) => ipcRenderer.on("nativeThemeChanged", callback),
    onSearchIndexUpdated: (callback) => ipcRenderer.on("searchIndexUpdated", callback),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
    updateSettingByKey: <T>(key: string, value: T) => ipcRenderer.invoke("updateSettingByKey", { key, value }),
    windowFocused: (callback) => ipcRenderer.on("windowFocused", callback),
});
