import type { DependencyRegistry } from "../DependencyRegistry";
import { Logger } from "./Logger";

export class LoggerModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const ipcMain = dependencyRegistry.get("IpcMain");
        const clock = dependencyRegistry.get("Clock");

        const logger = new Logger(clock);

        dependencyRegistry.register("Logger", logger);
        ipcMain.on("getLogs", (event) => (event.returnValue = logger.getLogs()));
    }
}
