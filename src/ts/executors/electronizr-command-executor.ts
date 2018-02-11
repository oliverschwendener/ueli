import { ipcMain } from "electron";
import { Executor } from "./executor";

export class ElectronizrCommandExecutor implements Executor {
    private prefix = "ezr:";

    public execute(command: string): void {
        ipcMain.emit(command);
    }

    public isValidForExecution(command: string): boolean {
        return command.startsWith(this.prefix)
            && command.length > this.prefix.length;
    }
}