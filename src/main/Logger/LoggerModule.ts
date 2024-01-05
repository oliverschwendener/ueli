import type { IpcMain } from "electron";
import { Clock } from "../Clock";
import type { DependencyInjector } from "../DependencyInjector";
import type { Logger as LoggerInterface } from "./Contract";
import { Logger } from "./Logger";

export class LoggerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");
        const clock = dependencyInjector.getInstance<Clock>("Clock");

        const logger = new Logger(clock);

        dependencyInjector.registerInstance<LoggerInterface>("Logger", logger);
        ipcMain.on("getLogs", (event) => (event.returnValue = logger.getLogs()));
    }
}
