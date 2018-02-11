import { ipcMain } from "electron";
import { Executor } from "./executor";

export class ElectronizrCommandExecutor implements Executor {
    public execute(command: string): void {
        ipcMain.emit(command);
    }

    public isValidForExecution(command: string): boolean {
        return command.startsWith("ezr:");
    }
}