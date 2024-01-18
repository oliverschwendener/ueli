import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";

export class NativeThemeModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const nativeTheme = dependencyRegistry.get("NativeTheme");
        const ipcMain = dependencyRegistry.get("IpcMain");

        ipcMain.on("themeShouldUseDarkColors", (event) => (event.returnValue = nativeTheme.shouldUseDarkColors));
    }
}
