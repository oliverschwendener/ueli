import type { DragAndDrop } from "@common/Core";
import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { app } from "electron";

export class DragAndDropModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const ipcMain = moduleRegistry.get("IpcMain");
        ipcMain.on("dragStarted", async ({ sender }, { filePath }: DragAndDrop) => {
            const icon = await app.getFileIcon(filePath);

            sender.startDrag({
                file: filePath,
                icon,
            });
        });
    }
}
