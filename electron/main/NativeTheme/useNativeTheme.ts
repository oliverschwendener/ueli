import type { IpcMain, NativeTheme } from "electron";

export const useNativeTheme = ({ ipcMain, nativeTheme }: { ipcMain: IpcMain; nativeTheme: NativeTheme }) => {
    ipcMain.on("themeShouldUseDarkColors", (event) => (event.returnValue = nativeTheme.shouldUseDarkColors));
};
