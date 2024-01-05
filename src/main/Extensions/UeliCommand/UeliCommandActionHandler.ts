import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import type { App } from "electron";
import type { ActionHandler } from "../../ActionHandler";
import type { EventEmitter } from "../../EventEmitter";
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
            settings: async () => this.eventEmitter.emitEvent("ueliCommandOpenSettingsActionInvoked"),
            extensions: async () => this.eventEmitter.emitEvent("ueliCommandOpenExtensionsActionInvoked"),
        };

        return map[action.argument]();
    }
}
