import { IpcEmitter } from "./ipc-emitter";
import { ipcMain } from "electron";
import { IpcChannels } from "./ipc-channels";

export class ProductionIpcEmitter implements IpcEmitter {
    public emitResetUserInput(): void {
        ipcMain.emit(IpcChannels.resetUserInput);
    }

    public emitHideWindow(): void {
        ipcMain.emit(IpcChannels.hideWindow);
    }
}
