import type { OpenExternalOptions } from "electron";
import type { DependencyInjector } from "..";

export class ShellModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const shell = dependencyInjector.getInstance("Shell");
        const ipcMain = dependencyInjector.getInstance("IpcMain");

        ipcMain.handle("openExternal", (_, { url, options }: { url: string; options?: OpenExternalOptions }) =>
            shell.openExternal(url, options),
        );
    }
}
