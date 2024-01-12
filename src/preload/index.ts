import type { ContextBridge } from "@common/ContextBridge";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ContextBridge", <ContextBridge>{
    ipcRenderer: {
        on: (channel, listener) => ipcRenderer.on(channel, listener),
    },

    copyTextToClipboard: (textToCopy) => ipcRenderer.send("copyTextToClipboard", { textToCopy }),
    extensionDisabled: (extensionId: string) => ipcRenderer.send("extensionDisabled", { extensionId }),
    extensionEnabled: (extensionId: string) => ipcRenderer.send("extensionEnabled", { extensionId }),
    getAboutUeli: () => ipcRenderer.sendSync("getAboutUeli"),
    getLogs: () => ipcRenderer.sendSync("getLogs"),
    getSearchResultItems: () => ipcRenderer.sendSync("getSearchResultItems"),
    getSettingByKey: <T>(key: string, defaultValue: T): T =>
        ipcRenderer.sendSync("getSettingByKey", { key, defaultValue }),
    getAvailableExtensions: () => ipcRenderer.sendSync("getAvailableExtensions"),
    getOperatingSystem: () => ipcRenderer.sendSync("getOperatingSystem"),
    getExtensionSettingByKey: (extensionId, key, defaultValue) =>
        ipcRenderer.sendSync("getExtensionSettingByKey", { extensionId, key, defaultValue }),
    getExtensionSettingDefaultValue: (extensionId, settingKey) =>
        ipcRenderer.sendSync("getExtensionSettingDefaultValue", { extensionId, settingKey }),
    getExtensionImageUrl: (extensionId) => ipcRenderer.sendSync("getExtensionImageUrl", { extensionId }),
    invokeAction: (action) => ipcRenderer.invoke("invokeAction", { action }),
    invokeExtension: (extensionId, argument) => ipcRenderer.invoke("invokeExtension", { extensionId, argument }),
    showOpenDialog: (options) => ipcRenderer.invoke("showOpenDialog", { options }),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
    updateSettingByKey: <T>(key: string, value: T) => ipcRenderer.invoke("updateSettingByKey", { key, value }),
});
