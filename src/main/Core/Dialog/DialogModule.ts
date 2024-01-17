import type { OpenDialogOptions } from "electron";
import type { DependencyInjector } from "../DependencyInjector";

export class DialogModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const dialog = dependencyInjector.getInstance("Dialog");
        const ipcMain = dependencyInjector.getInstance("IpcMain");

        ipcMain.handle("showOpenDialog", (_, { options }: { options: OpenDialogOptions }) =>
            dialog.showOpenDialog(options),
        );
    }
}
