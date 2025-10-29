import type { SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "@Core/ActionHandler";
import type { TodoistActionManager } from "../Manager";

export const TodoistOpenTaskHandlerId = "TodoistOpenTask";

export class TodoistOpenTaskActionHandler implements ActionHandler {
    public readonly id = TodoistOpenTaskHandlerId;

    public constructor(private readonly actionManager: TodoistActionManager) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const params = this.parseArgument(action.argument);
        await this.actionManager.openTask(params);
    }

    private parseArgument(argument: string): {
        taskId: string;
        webUrl: string;
        desktopUrl: string;
        searchTerm: string;
    } {
        const parsed = JSON.parse(argument) as {
            taskId?: unknown;
            webUrl?: unknown;
            desktopUrl?: unknown;
            searchTerm?: unknown;
        };

        if (!parsed) {
            throw new Error("Todoist open task action requires an argument.");
        }

        if (typeof parsed.taskId !== "string" || parsed.taskId.trim().length === 0) {
            throw new Error("Todoist open task action requires a taskId string argument.");
        }

        if (typeof parsed.webUrl !== "string" || parsed.webUrl.trim().length === 0) {
            throw new Error("Todoist open task action requires a webUrl string argument.");
        }

        if (typeof parsed.desktopUrl !== "string" || parsed.desktopUrl.trim().length === 0) {
            throw new Error("Todoist open task action requires a desktopUrl string argument.");
        }

        if (typeof parsed.searchTerm !== "string") {
            throw new Error("Todoist open task action requires a searchTerm string argument.");
        }

        return {
            taskId: parsed.taskId,
            webUrl: parsed.webUrl,
            desktopUrl: parsed.desktopUrl,
            searchTerm: parsed.searchTerm,
        };
    }
}
