import type { ContextBridge } from "@common/ContextBridge";
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
    getExtensionSettingByKey: (extensionId, key, defaultValue) =>
        ipcRenderer.sendSync("getExtensionSettingByKey", { extensionId, key, defaultValue }),
    getExtensionSettingDefaultValue: (extensionId, settingKey) =>
        ipcRenderer.sendSync("getExtensionSettingDefaultValue", { extensionId, settingKey }),
    getLogs: () => ipcRenderer.sendSync("getLogs"),
    getOperatingSystem: () => ipcRenderer.sendSync("getOperatingSystem"),
    getSearchResultItems: () => ipcRenderer.sendSync("getSearchResultItems"),
    getSettingByKey: (key, defaultValue) => ipcRenderer.sendSync("getSettingByKey", { key, defaultValue }),
    invokeAction: (action) => ipcRenderer.invoke("invokeAction", { action }),
    invokeExtension: (extensionId, argument) => ipcRenderer.invoke("invokeExtension", { extensionId, argument }),
    openExternal: (url, options) => ipcRenderer.invoke("openExternal", { url, options }),
    showOpenDialog: (options) => ipcRenderer.invoke("showOpenDialog", { options }),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
    updateExtensionSettingByKey: (extensionId, key, value) =>
        ipcRenderer.invoke("updateExtensionSettingByKey", { extensionId, key, value }),
    updateSettingByKey: (key, value) => ipcRenderer.invoke("updateSettingByKey", { key, value }),
});
