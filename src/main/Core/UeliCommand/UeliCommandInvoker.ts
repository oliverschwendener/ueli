import type { App } from "electron";
import type { EventEmitter } from "../EventEmitter";
import type {
    UeliCommand,
    UeliCommandInvokedEvent,
    UeliCommandInvoker as UeliCommandInvokerInterface,
} from "./Contract";

export class UeliCommandInvoker implements UeliCommandInvokerInterface {
    public constructor(
        private readonly app: App,
        private readonly eventEmitter: EventEmitter,
    ) {}

    public invokeUeliCommand(ueliCommand: UeliCommand): Promise<void> {
        const map: Record<UeliCommand, () => Promise<void>> = {
            openExtensions: async () =>
                this.emitUeliCommandInvokedEvent({
                    ueliCommand: "openExtensions",
                    argument: { pathname: "/settings/extensions" },
                }),
            openSettings: async () =>
                this.emitUeliCommandInvokedEvent({
                    ueliCommand: "openSettings",
                    argument: { pathname: "/settings/general" },
                }),
            openAbout: async () =>
                this.emitUeliCommandInvokedEvent({
                    ueliCommand: "openAbout",
                    argument: { pathname: "/settings/about" },
                }),
            quit: async () => this.app.quit(),
            show: async () =>
                this.emitUeliCommandInvokedEvent({
                    ueliCommand: "show",
                    argument: { pathname: "/" },
                }),
            centerWindow: () =>
                this.emitUeliCommandInvokedEvent({
                    ueliCommand: "centerWindow",
                    argument: {},
                }),
            rescanExtensions: () =>
                this.emitUeliCommandInvokedEvent({
                    ueliCommand: "rescanExtensions",
                    argument: null,
                }),
        };

        return map[ueliCommand]();
    }

    private async emitUeliCommandInvokedEvent<T>(event: UeliCommandInvokedEvent<T>) {
        this.eventEmitter.emitEvent("ueliCommandInvoked", event);
    }
}
