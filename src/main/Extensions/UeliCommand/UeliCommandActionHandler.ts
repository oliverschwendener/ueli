import type { SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "@Core/ActionHandler";
import type { UeliCommandInvoker } from "@Core/UeliCommand";

export class UeliCommandActionHandler implements ActionHandler {
    public readonly id = "UeliCommand";

    public constructor(private readonly ueliCommandInvoker: UeliCommandInvoker) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const map: Record<string, () => Promise<void>> = {
            quit: () => this.ueliCommandInvoker.invokeUeliCommand("quit"),
            settings: () => this.ueliCommandInvoker.invokeUeliCommand("openSettings"),
            extensions: () => this.ueliCommandInvoker.invokeUeliCommand("openExtensions"),
            centerWindow: () => this.ueliCommandInvoker.invokeUeliCommand("centerWindow"),
            rescanExtensions: () => this.ueliCommandInvoker.invokeUeliCommand("rescanExtensions"),
        };

        if (!Object.keys(map).includes(action.argument)) {
            throw new Error(`Unexpected argument: ${action.argument}`);
        }

        await map[action.argument]();
    }
}
