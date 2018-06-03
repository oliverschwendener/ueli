import { IpcEmitter } from "../../ts/ipc-emitter";

export class FakeIpcEmitter implements IpcEmitter {
    public userInputHasBeenReset: boolean = false;
    public windowHasBeenHidden: boolean = false;

    public emitResetUserInput(): void {
        this.userInputHasBeenReset = true;
    }

    public emitHideWindow(): void {
        this.windowHasBeenHidden = true;
    }
}
