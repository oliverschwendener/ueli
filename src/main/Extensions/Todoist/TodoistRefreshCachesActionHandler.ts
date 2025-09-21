import type { ActionHandler } from "@Core/ActionHandler";
import type { Logger } from "@Core/Logger";
import type { SearchResultItemAction } from "@common/Core";

export const RefreshCachesHandlerId = "TodoistRefreshCaches";

export class TodoistRefreshCachesActionHandler implements ActionHandler {
    public readonly id = RefreshCachesHandlerId;

    public constructor(
        private readonly reloadTasks: (searchTerm: string) => Promise<void>,
        private readonly logger: Logger,
    ) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const { searchTerm } = this.parseArgument(action.argument);

        try {
            await this.reloadTasks(searchTerm);
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
