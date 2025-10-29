import type { SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "@Core/ActionHandler";
import type { Logger } from "@Core/Logger";
import type { TodoistActionManager } from "../Manager";

export const RefreshCachesHandlerId = "TodoistRefreshCaches";

export class TodoistRefreshCachesActionHandler implements ActionHandler {
    public readonly id = RefreshCachesHandlerId;

    public constructor(
        private readonly actionManager: TodoistActionManager,
        private readonly logger: Logger,
    ) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const { searchTerm } = this.parseArgument(action.argument);

        try {
            await this.actionManager.refreshCaches(searchTerm);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Todoist task reload failed. Reason: ${message}`);
        }
    }

    private parseArgument(argument: string): { searchTerm: string } {
        const parsed = JSON.parse(argument) as { searchTerm?: unknown };

        if (!parsed || typeof parsed.searchTerm !== "string") {
            throw new Error("Todoist refresh caches action requires a searchTerm string argument.");
        }

        return { searchTerm: parsed.searchTerm };
    }
}
