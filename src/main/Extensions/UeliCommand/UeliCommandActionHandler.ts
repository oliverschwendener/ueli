import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { App } from "electron";
import type { ActionHandler } from "../../ActionHandler";
import type { EventEmitter } from "../../EventEmitter";
import type { UeliCommandInvokedEvent } from "./Contract";
import type { UeliCommand } from "./UeliCommand";

export class UeliCommandActionHandler implements ActionHandler {
    public readonly id = "UeliCommand";

    public constructor(
        private readonly app: App,
        private readonly eventEmitter: EventEmitter,
    ) {}

    public invokeAction(action: SearchResultItemAction): Promise<void> {
        const map: Record<UeliCommand, () => Promise<void>> = {
            quit: async () => this.app.quit(),
            settings: async () =>
                this.eventEmitter.emitEvent("ueliCommandInvoked", <UeliCommandInvokedEvent>{
                    navigateTo: { pathname: "/settings/general" },
                }),
            extensions: async () =>
                this.eventEmitter.emitEvent("ueliCommandInvoked", <UeliCommandInvokedEvent>{
                    navigateTo: { pathname: "/settings/extensions" },
                }),
        };

        return map[action.argument]();
    }
}
