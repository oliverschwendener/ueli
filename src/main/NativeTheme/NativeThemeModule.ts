import type { DependencyInjector } from "@common/DependencyInjector";
import type { IpcMain, NativeTheme } from "electron";

export class NativeThemeModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const nativeTheme = dependencyInjector.getInstance<NativeTheme>("NativeTheme");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        ipcMain.on("themeShouldUseDarkColors", (event) => (event.returnValue = nativeTheme.shouldUseDarkColors));
    }
}
