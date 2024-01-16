import type { UeliCommand } from "./UeliCommand";

export type UeliCommandInvokedEvent<T> = {
    ueliCommand: UeliCommand;
    argument: T;
};
