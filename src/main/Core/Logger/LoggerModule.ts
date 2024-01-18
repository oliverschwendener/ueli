import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { Logger } from "./Logger";

export class LoggerModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const ipcMain = dependencyRegistry.get("IpcMain");
        const clock = dependencyRegistry.get("Clock");

        const logger = new Logger(clock);

        dependencyRegistry.register("Logger", logger);
        ipcMain.on("getLogs", (event) => (event.returnValue = logger.getLogs()));
    }
}
