import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";

export class AutostartModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const logger = dependencyRegistry.get("Logger");
        const ipcMain = dependencyRegistry.get("IpcMain");

        const setAutostartOptions = (openAtLogin: boolean) => {
            if (!app.isPackaged) {
                logger.info("Skipping setAutostartOptions. Reason: app is not packaged");
                return;
            }

            app.setLoginItemSettings({
                args: [],
                openAtLogin,
                path: process.execPath,
            });
        };

        ipcMain.on("autostartIsEnabled", (event) => (event.returnValue = app.getLoginItemSettings().openAtLogin));

        ipcMain.on("autostartSettingsChanged", (_, { autostartIsEnabled }: { autostartIsEnabled: boolean }) =>
            setAutostartOptions(autostartIsEnabled),
        );
    }
}
