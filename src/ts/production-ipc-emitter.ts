import { IpcEmitter } from "./ipc-emitter";
import { ipcMain } from "electron";
import { IpcChannels } from "./ipc-channels";

export class ProductionIpcEmitter implements IpcEmitter {
    private readonly windowHideDelayInMilliSeconds = 50;

    public emitResetUserInput(): void {
        ipcMain.emit(IpcChannels.resetUserInput);
    }

    public emitHideWindow(): void {

        setTimeout((): void => {
            ipcMain.emit(IpcChannels.hideWindow);
        }, this.windowHideDelayInMilliSeconds); // set delay when hiding main window so user input can be reset properly
    }
}
