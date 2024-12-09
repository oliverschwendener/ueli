import type { OperatingSystem } from "@common/Core";
import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OpenExternalOptions } from "electron";
import { OpenFilePathActionHandler, ShowItemInFileExplorerActionHandler, UrlActionHandler } from "./ActionHandler";
import {
    type CustomWebBrowserActionHandler,
    LinuxCustomWebBrowserActionHandler,
    MacOsCustomWebBrowserActionHandler,
    WindowsCustomWebBrowserActionHandler,
} from "./ActionHandler/CustomWebBrowser";

export class ShellModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const shell = dependencyRegistry.get("Shell");
        const ipcMain = dependencyRegistry.get("IpcMain");
        const actionHandlerRegistry = dependencyRegistry.get("ActionHandlerRegistry");

        actionHandlerRegistry.register(new OpenFilePathActionHandler(shell));
        actionHandlerRegistry.register(new ShowItemInFileExplorerActionHandler(shell));

        const customWebBrowserActionHandlers: Record<OperatingSystem, () => CustomWebBrowserActionHandler> = {
            macOS: () =>
                new MacOsCustomWebBrowserActionHandler(
                    dependencyRegistry.get("SettingsManager"),
                    dependencyRegistry.get("CommandlineUtility"),
                ),
            Linux: () => new LinuxCustomWebBrowserActionHandler(),
            Windows: () => new WindowsCustomWebBrowserActionHandler(),
        };

        actionHandlerRegistry.register(
            new UrlActionHandler(shell, customWebBrowserActionHandlers[dependencyRegistry.get("OperatingSystem")]()),
        );

        ipcMain.handle("openExternal", (_, { url, options }: { url: string; options?: OpenExternalOptions }) =>
            shell.openExternal(url, options),
        );
    }
}
