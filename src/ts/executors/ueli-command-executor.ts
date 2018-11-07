import { ipcMain } from "electron";
import { Executor } from "./executor";

export class UeliCommandExecutor implements Executor {
    public hideAfterExecution = false;
    public logExecution = true;
    public resetUserInputAfterExecution = true;

    public execute(command: string): void {
        ipcMain.emit(command);
    }
}
