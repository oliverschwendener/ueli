import type { DependencyRegistry } from "../DependencyRegistry";

export class NativeThemeModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const nativeTheme = dependencyRegistry.get("NativeTheme");
        const ipcMain = dependencyRegistry.get("IpcMain");

        ipcMain.on("themeShouldUseDarkColors", (event) => (event.returnValue = nativeTheme.shouldUseDarkColors));
    }
}
