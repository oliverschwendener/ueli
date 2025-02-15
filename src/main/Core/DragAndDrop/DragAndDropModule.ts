import type { DragAndDrop } from "@common/Core";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { app } from "electron";

export class DragAndDropModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const ipcMain = moduleRegistry.get("IpcMain");

        ipcMain.on("dragStarted", async ({ sender }, { filePath }: DragAndDrop) => {
            sender.startDrag({
                file: filePath,
                icon: await app.getFileIcon(filePath),
            });
        });
    }
}
