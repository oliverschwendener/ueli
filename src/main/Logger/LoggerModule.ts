import type { IpcMain } from "electron";
import type { DependencyInjector } from "../DependencyInjector";
import type { Logger as LoggerInterface } from "./Contract";
import { Logger } from "./Logger";

export class LoggerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const ipcMain = dependencyInjector.getInstance<IpcMain>("IpcMain");

        const logger = new Logger();

        dependencyInjector.registerInstance<LoggerInterface>("Logger", logger);
        ipcMain.on("getLogs", (event) => (event.returnValue = logger.getLogs()));
    }
}
