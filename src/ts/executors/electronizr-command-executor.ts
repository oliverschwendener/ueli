import { ipcMain } from "electron";
import { Config } from "../config";
import { Executor } from "./executor";

export class ElectronizrCommandExecutor implements Executor {
    public execute(command: string): void {
        ipcMain.emit(command);
    }

    public hideAfterExecution(): boolean {
        return false;
    }
}
