import type { DependencyInjector } from "../DependencyInjector";
import { Logger } from "./Logger";

export class LoggerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const ipcMain = dependencyInjector.getInstance("IpcMain");
        const clock = dependencyInjector.getInstance("Clock");

        const logger = new Logger(clock);

        dependencyInjector.registerInstance("Logger", logger);
        ipcMain.on("getLogs", (event) => (event.returnValue = logger.getLogs()));
    }
}
