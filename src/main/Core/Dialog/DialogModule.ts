import type { OpenDialogOptions } from "electron";
import type { DependencyRegistry } from "../DependencyRegistry";

export class DialogModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const dialog = dependencyRegistry.get("Dialog");
        const ipcMain = dependencyRegistry.get("IpcMain");

        ipcMain.handle("showOpenDialog", (_, { options }: { options: OpenDialogOptions }) =>
            dialog.showOpenDialog(options),
        );
    }
}
