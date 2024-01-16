import type { ContextBridge } from "@common/Core";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ContextBridge", <ContextBridge>{
    ipcRenderer: {
        on: (channel, listener) => ipcRenderer.on(channel, listener),
    },

    copyTextToClipboard: (textToCopy) => ipcRenderer.send("copyTextToClipboard", { textToCopy }),
    extensionDisabled: (extensionId) => ipcRenderer.send("extensionDisabled", { extensionId }),
    extensionEnabled: (extensionId) => ipcRenderer.send("extensionEnabled", { extensionId }),
    getAboutUeli: () => ipcRenderer.sendSync("getAboutUeli"),
    getAvailableExtensions: () => ipcRenderer.sendSync("getAvailableExtensions"),
    getExtensionImageUrl: (extensionId) => ipcRenderer.sendSync("getExtensionImageUrl", { extensionId }),
    getExtensionSettingDefaultValue: (extensionId, settingKey) =>
        ipcRenderer.sendSync("getExtensionSettingDefaultValue", { extensionId, settingKey }),
    getLogs: () => ipcRenderer.sendSync("getLogs"),
    getOperatingSystem: () => ipcRenderer.sendSync("getOperatingSystem"),
    getSearchResultItems: () => ipcRenderer.sendSync("getSearchResultItems"),
    getSettingValue: (key, defaultValue, isSensitive) =>
        ipcRenderer.sendSync("getSettingValue", { key, defaultValue, isSensitive }),
    invokeAction: (action) => ipcRenderer.invoke("invokeAction", { action }),
    invokeExtension: (extensionId, argument) => ipcRenderer.invoke("invokeExtension", { extensionId, argument }),
    openExternal: (url, options) => ipcRenderer.invoke("openExternal", { url, options }),
    showOpenDialog: (options) => ipcRenderer.invoke("showOpenDialog", { options }),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
    updateSettingValue: (key, value, isSensitive) =>
        ipcRenderer.invoke("updateSettingValue", { key, value, isSensitive }),
});
