import type { Dialog, IpcMain, OpenDialogOptions } from "electron";
import type { DependencyInjector } from "../DependencyInjector";

export class DialogModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const dialog = dependencyInjector.getInstance<Dialog>("Dialog");
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        ipcMain.handle("showOpenDialog", (_, { options }: { options: OpenDialogOptions }) =>
            dialog.showOpenDialog(options),
        );
    }
}
