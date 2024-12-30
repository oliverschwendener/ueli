import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { DefaultAutostartManager } from "./DefaultAutostartManager";
import { WindowsStoreAutostartManager } from "./WindowsStoreAutostartManager";

export class AutostartModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const app = moduleRegistry.get("App");
        const logger = moduleRegistry.get("Logger");
        const ipcMain = moduleRegistry.get("IpcMain");
        const shell = moduleRegistry.get("Shell");
        const fileSystemUtility = moduleRegistry.get("FileSystemUtility");

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
