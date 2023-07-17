import { ContextBridge } from "@common/ContextBridge";
import { SearchResultItem } from "@common/SearchResultItem";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ContextBridge", <ContextBridge>{
    onNativeThemeChanged: (callback: () => void) => ipcRenderer.on("nativeThemeChanged", callback),

    getSearchResultItems: () => ipcRenderer.sendSync("getSearchResultItems"),

    onSearchResultItemsUpdated: (callback: (searchResultItems: SearchResultItem[]) => void) =>
        ipcRenderer.on("searchResultItemsUpdated", (_, { searchResultItems }) => callback(searchResultItems)),

    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
});
