import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { NodeJsFileSystemUtility } from "./NodeJsFileSystemUtility";

export class FileSystemUtilityModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const ipcMain = moduleRegistry.get("IpcMain");

        const fileSystemUtility = new NodeJsFileSystemUtility();
        moduleRegistry.register("FileSystemUtility", fileSystemUtility);

        ipcMain.on("fileExists", (event, { filePath }: { filePath: string }) => {
            event.returnValue = fileSystemUtility.existsSync(filePath);
        });
    }
}
