import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OpenExternalOptions } from "electron";

export class ShellModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const shell = dependencyRegistry.get("Shell");
        const ipcMain = dependencyRegistry.get("IpcMain");

        ipcMain.handle("openExternal", (_, { url, options }: { url: string; options?: OpenExternalOptions }) =>
            shell.openExternal(url, options),
        );
    }
}
