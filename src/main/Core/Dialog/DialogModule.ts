import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OpenDialogOptions } from "electron";

export class DialogModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const dialog = dependencyRegistry.get("Dialog");
        const ipcMain = dependencyRegistry.get("IpcMain");

        ipcMain.handle("showOpenDialog", (_, { options }: { options: OpenDialogOptions }) =>
            dialog.showOpenDialog(options),
        );
    }
}
