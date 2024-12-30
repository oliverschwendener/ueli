import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { Logger } from "./Logger";

export class LoggerModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const ipcMain = moduleRegistry.get("IpcMain");

        const logger = new Logger(moduleRegistry.get("DateProvider"), moduleRegistry.get("BrowserWindowNotifier"));

        moduleRegistry.register("Logger", logger);
        ipcMain.on("getLogs", (event) => (event.returnValue = logger.getLogs()));
    }
}
