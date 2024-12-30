import type { OperatingSystem } from "@common/Core";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { OpenExternalOptions } from "electron";
import { OpenFilePathActionHandler, ShowItemInFileExplorerActionHandler, UrlActionHandler } from "./ActionHandler";
import {
    type CustomWebBrowserActionHandler,
    LinuxCustomWebBrowserActionHandler,
    MacOsCustomWebBrowserActionHandler,
    WindowsCustomWebBrowserActionHandler,
} from "./ActionHandler/CustomWebBrowser";

export class ShellModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const shell = moduleRegistry.get("Shell");
        const ipcMain = moduleRegistry.get("IpcMain");
        const actionHandlerRegistry = moduleRegistry.get("ActionHandlerRegistry");

        actionHandlerRegistry.register(new OpenFilePathActionHandler(shell));
        actionHandlerRegistry.register(new ShowItemInFileExplorerActionHandler(shell));

        const customWebBrowserActionHandlers: Record<OperatingSystem, () => CustomWebBrowserActionHandler> = {
            macOS: () =>
                new MacOsCustomWebBrowserActionHandler(
                    moduleRegistry.get("SettingsManager"),
                    moduleRegistry.get("CommandlineUtility"),
                ),
            Linux: () => new LinuxCustomWebBrowserActionHandler(),
            Windows: () =>
                new WindowsCustomWebBrowserActionHandler(
                    moduleRegistry.get("PowershellUtility"),
                    moduleRegistry.get("SettingsManager"),
                ),
        };

        actionHandlerRegistry.register(
            new UrlActionHandler(shell, customWebBrowserActionHandlers[moduleRegistry.get("OperatingSystem")]()),
        );

        ipcMain.handle("openExternal", (_, { url, options }: { url: string; options?: OpenExternalOptions }) =>
            shell.openExternal(url, options),
        );
    }
}
