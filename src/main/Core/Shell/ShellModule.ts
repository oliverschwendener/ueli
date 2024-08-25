import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OpenExternalOptions } from "electron";
import { OpenFilePathActionHandler, ShowItemInFileExplorerActionHandler, UrlActionHandler } from "./ActionHandler";

export class ShellModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const shell = dependencyRegistry.get("Shell");
        const ipcMain = dependencyRegistry.get("IpcMain");

        const actionHandlerRegistry = dependencyRegistry.get("ActionHandlerRegistry");

        actionHandlerRegistry.register(new OpenFilePathActionHandler(shell));
        actionHandlerRegistry.register(new ShowItemInFileExplorerActionHandler(shell));
        actionHandlerRegistry.register(new UrlActionHandler(shell));

        ipcMain.handle("openExternal", (_, { url, options }: { url: string; options?: OpenExternalOptions }) =>
            shell.openExternal(url, options),
        );
    }
}
