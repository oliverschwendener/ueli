import { ipcMain } from "electron";
import { Executor } from "./executor";
import { SearchResultItem } from "../search-engine";
import { Config } from "../config";

export class ElectronizrCommandExecutor implements Executor {
    private commands = [
        <ElectronizrCommand>{
            description: "Reload electronizr",
            command: `reload`
        },
        <ElectronizrCommand>{
            description: "Exit electronizr",
            command: `exit`
        }
    ];  

    public execute(command: string): void {
        ipcMain.emit(command);
    }

    public hideAfterExecution(): boolean {
        return false;
    }
}

class ElectronizrCommand {
    public description: string;
    public command: string;
}