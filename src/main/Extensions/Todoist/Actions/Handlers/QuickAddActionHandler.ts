import type { SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "@Core/ActionHandler";
import type { TodoistActionManager } from "../Manager";

const QuickAddHandlerId = "TodoistQuickAdd";

export class TodoistQuickAddActionHandler implements ActionHandler {
    public readonly id = QuickAddHandlerId;

    public constructor(private readonly actionManager: TodoistActionManager) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const { text } = this.parseArgument(action.argument);
        await this.actionManager.quickAdd(text);
    }

    private parseArgument(argument: string): { text: string } {
        const parsed = JSON.parse(argument) as { text?: unknown };

        if (!parsed || typeof parsed.text !== "string" || parsed.text.trim().length === 0) {
            throw new Error("Todoist quick add action requires a non-empty text argument.");
        }

        return { text: parsed.text };
    }
}

export { QuickAddHandlerId };
