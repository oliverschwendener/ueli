import type { OpenExternalOptions } from "electron";
import type { DependencyRegistry } from "..";

export class ShellModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const shell = dependencyRegistry.get("Shell");
        const ipcMain = dependencyRegistry.get("IpcMain");

        ipcMain.handle("openExternal", (_, { url, options }: { url: string; options?: OpenExternalOptions }) =>
            shell.openExternal(url, options),
        );
    }
}
