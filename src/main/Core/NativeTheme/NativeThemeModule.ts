import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";

export class NativeThemeModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const nativeTheme = dependencyRegistry.get("NativeTheme");
        const ipcMain = dependencyRegistry.get("IpcMain");
        const browserWindowNotifier = dependencyRegistry.get("BrowserWindowNotifier");

        ipcMain.on("themeShouldUseDarkColors", (event) => (event.returnValue = nativeTheme.shouldUseDarkColors));

        nativeTheme.addListener("updated", () => browserWindowNotifier.notify("nativeThemeChanged"));
    }
}
