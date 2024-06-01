import type { ActionHandler } from "@Core/ActionHandler";
import type { Logger } from "@Core/Logger";
import type { SearchResultItemAction } from "@common/Core";
import { WorkflowActionArgumentDecoder } from "./Utility";
import type { WorkflowActionHandler } from "./WorkflowActionHandler/WorkflowActionHandler";

export class WorkflowHandler implements ActionHandler {
    public readonly id = "Workflow";

    public constructor(
        private readonly logger: Logger,
        private workflowActionHandlers: Record<string, WorkflowActionHandler>,
    ) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const workflowActions = WorkflowActionArgumentDecoder.decodeArgument(action.argument);

        for (const workflowAction of workflowActions) {
            const workflowActionHandler = this.workflowActionHandlers[workflowAction.handlerId];

            if (!workflowActionHandler) {
                this.logger.error(`No workflow action handler found for handler ID: ${workflowAction.handlerId}`);
                continue;
            }

            await workflowActionHandler.invokeWorkflowAction(workflowAction);
        }
    }
}
