import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { NodeJsFileSystemUtility } from "./NodeJsFileSystemUtility";

export class FileSystemUtilityModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const ipcMain = dependencyRegistry.get("IpcMain");

        const fileSystemUtility = new NodeJsFileSystemUtility();
        dependencyRegistry.register("FileSystemUtility", fileSystemUtility);

        ipcMain.on("fileExists", (event, { filePath }: { filePath: string }) => {
            event.returnValue = fileSystemUtility.existsSync(filePath);
        });
    }
}
