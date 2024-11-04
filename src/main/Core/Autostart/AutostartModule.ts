import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { DefaultAutostartManager } from "./DefaultAutostartManager";
import { WindowsStoreAutostartManager } from "./WindowsStoreAutostartManager";

export class AutostartModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const logger = dependencyRegistry.get("Logger");
        const ipcMain = dependencyRegistry.get("IpcMain");
        const shell = dependencyRegistry.get("Shell");
        const fileSystemUtility = dependencyRegistry.get("FileSystemUtility");

        const autostartManager = process.windowsStore
            ? new WindowsStoreAutostartManager(app, shell, process, fileSystemUtility, logger)
            : new DefaultAutostartManager(app, process);

        const setAutostartOptions = (openAtLogin: boolean) => {
            if (!app.isPackaged) {
                logger.info("Skipping setAutostartOptions. Reason: app is not packaged");
                return;
            }

            autostartManager.setAutostartOptions(openAtLogin);
        };

        ipcMain.on("autostartIsEnabled", (event) => (event.returnValue = autostartManager.autostartIsEnabled()));

        ipcMain.on("autostartSettingsChanged", (_, { autostartIsEnabled }: { autostartIsEnabled: boolean }) =>
            setAutostartOptions(autostartIsEnabled),
        );
    }
}
