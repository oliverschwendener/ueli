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
                this.eventEmitter.emitEvent("ueliCommandInvoked", <UeliCommandInvokedEvent>{
                    navigateTo: { pathname: "/settings/extensions" },
                }),
            openSettings: async () =>
                this.eventEmitter.emitEvent("ueliCommandInvoked", <UeliCommandInvokedEvent>{
                    navigateTo: { pathname: "/settings/general" },
                }),
            openAbout: async () =>
                this.eventEmitter.emitEvent("ueliCommandInvoked", <UeliCommandInvokedEvent>{
                    navigateTo: { pathname: "/settings/about" },
                }),
            quit: async () => this.app.quit(),
            show: async () =>
                this.eventEmitter.emitEvent("ueliCommandInvoked", <UeliCommandInvokedEvent>{
                    navigateTo: { pathname: "/" },
                }),
        };

        return map[ueliCommand]();
    }
}
