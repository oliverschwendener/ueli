import type { ActionHandler } from "@Core/ActionHandler";
import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { SearchResultItemAction } from "@common/Core";

export const SetSearchTermHandlerId = "TodoistSetSearchTerm";

export class TodoistSetSearchTermActionHandler implements ActionHandler {
    public readonly id = SetSearchTermHandlerId;

    public constructor(private readonly browserWindowNotifier: BrowserWindowNotifier) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const { newSearchTerm } = this.parseArgument(action.argument);

        this.browserWindowNotifier.notify({
            browserWindowId: "search",
            channel: "setSearchTerm",
            data: newSearchTerm,
        });
    }

    private parseArgument(argument: string): { newSearchTerm: string } {
        const parsed = JSON.parse(argument) as { newSearchTerm?: unknown };

        if (!parsed || typeof parsed.newSearchTerm !== "string") {
            throw new Error("Todoist set search term action requires a string newSearchTerm argument.");
        }

        return { newSearchTerm: parsed.newSearchTerm };
    }
}
