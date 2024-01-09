import type { UeliCommand } from "./UeliCommand";

export interface UeliCommandInvoker {
    invokeUeliCommand(ueliCommand: UeliCommand): Promise<void>;
}
