import { ipcMain } from "electron";
import { Executor } from "./executor";

export class UeliCommandExecutor implements Executor {
    public execute(command: string): void {
        ipcMain.emit(command);
    }

    public hideAfterExecution(): boolean {
        return false;
    }

    public resetUserInputAfterExecution(): boolean {
        return true;
    }
}
