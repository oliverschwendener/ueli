import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { OpenDialogOptions, SaveDialogOptions } from "electron";

export class DialogModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const dialog = moduleRegistry.get("Dialog");
        const ipcMain = moduleRegistry.get("IpcMain");

        ipcMain.handle("showOpenDialog", (_, { options }: { options: OpenDialogOptions }) =>
            dialog.showOpenDialog(options),
        );

        ipcMain.handle("showSaveDialog", (_, { options }: { options: SaveDialogOptions }) =>
            dialog.showSaveDialog(options),
        );
    }
}
