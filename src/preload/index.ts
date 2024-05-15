import type { ContextBridge } from "@common/Core";
import { contextBridge, ipcRenderer } from "electron";

const contextBridgeImplementation: ContextBridge = {
    ipcRenderer: {
        on: (channel, listener) => ipcRenderer.on(channel, listener),
    },

    autostartIsEnabled: () => ipcRenderer.sendSync("autostartIsEnabled"),
    autostartSettingsChanged: (autostartIsEnabled) =>
        ipcRenderer.send("autostartSettingsChanged", { autostartIsEnabled }),
    copyTextToClipboard: (textToCopy) => ipcRenderer.send("copyTextToClipboard", { textToCopy }),
    extensionDisabled: (extensionId) => ipcRenderer.send("extensionDisabled", { extensionId }),
    extensionEnabled: (extensionId) => ipcRenderer.send("extensionEnabled", { extensionId }),
    fileExists: (filePath: string) => ipcRenderer.sendSync("fileExists", { filePath }),
    getAboutUeli: () => ipcRenderer.sendSync("getAboutUeli"),
    getAvailableExtensions: () => ipcRenderer.sendSync("getAvailableExtensions"),
    getEnabledExtensions: () => ipcRenderer.sendSync("getEnabledExtensions"),
    getExtension: (extensionId) => ipcRenderer.sendSync("getExtension", { extensionId }),
    getExtensionResources: () => ipcRenderer.sendSync("getExtensionResources"),
    getExcludedSearchResultItemIds: () => ipcRenderer.sendSync("getExcludedSearchResultItemIds"),
    getExtensionAssetFilePath: (extensionId, key) =>
        ipcRenderer.sendSync("getExtensionAssetFilePath", { extensionId, key }),
    getExtensionSettingDefaultValue: (extensionId, settingKey) =>
        ipcRenderer.sendSync("getExtensionSettingDefaultValue", { extensionId, settingKey }),
    getFavorites: () => ipcRenderer.sendSync("getFavorites"),
    getLogs: () => ipcRenderer.sendSync("getLogs"),
    getInstantSearchResultItems: (searchTerm: string) =>
        ipcRenderer.sendSync("getInstantSearchResultItems", { searchTerm }),
    getOperatingSystem: () => ipcRenderer.sendSync("getOperatingSystem"),
    getSearchResultItems: () => ipcRenderer.sendSync("getSearchResultItems"),
    getSettingValue: (key, defaultValue, isSensitive) =>
        ipcRenderer.sendSync("getSettingValue", { key, defaultValue, isSensitive }),
    invokeAction: (action) => ipcRenderer.invoke("invokeAction", { action }),
    invokeExtension: (extensionId, argument) => ipcRenderer.invoke("invokeExtension", { extensionId, argument }),
    openExternal: (url, options) => ipcRenderer.invoke("openExternal", { url, options }),
    removeExcludedSearchResultItem: (itemId: string) =>
        ipcRenderer.invoke("removeExcludedSearchResultItem", { itemId }),
    removeFavorite: (id) => ipcRenderer.invoke("removeFavorite", { id }),
    resetAllSettings: () => ipcRenderer.invoke("resetAllSettings"),
    showOpenDialog: (options) => ipcRenderer.invoke("showOpenDialog", { options }),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
    triggerExtensionRescan: (extensionId) => ipcRenderer.invoke("triggerExtensionRescan", { extensionId }),
    updateSettingValue: (key, value, isSensitive) =>
        ipcRenderer.invoke("updateSettingValue", { key, value, isSensitive }),
};

contextBridge.exposeInMainWorld("ContextBridge", contextBridgeImplementation);
