import { ipcMain } from "electron";
import { Executor } from "./executor";
import { SearchResultItem } from "../search-engine";
import { Config } from "../config";

export class ElectronizrCommandExecutor implements Executor {
    public execute(command: string): void {
        ipcMain.emit(command);
    }

    public hideAfterExecution(): boolean {
        return false;
    }
}