import type { SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "@Core/ActionHandler";
import type { UeliCommand, UeliCommandInvoker } from "./Contract";

export class UeliCommandActionHandler implements ActionHandler {
    public readonly id = "UeliCommand";

    public constructor(private readonly ueliCommandInvoker: UeliCommandInvoker) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        await this.ueliCommandInvoker.invokeUeliCommand(action.argument as UeliCommand);
    }
}
