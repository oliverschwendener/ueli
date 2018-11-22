import { ipcMain } from "electron";
import { Executor } from "./executor";

export class UeliCommandExecutor implements Executor {
    public readonly hideAfterExecution = false;
    public readonly logExecution = true;
    public readonly resetUserInputAfterExecution = true;

    public execute(command: string): void {
        ipcMain.emit(command);
    }
}
