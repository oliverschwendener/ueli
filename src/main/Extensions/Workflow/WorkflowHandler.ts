import type { ActionHandler } from "@Core/ActionHandler";
import type { Logger } from "@Core/Logger";
import type { SearchResultItemAction } from "@common/Core";
import { WorkflowActionArgumentDecoder } from "./Utility";
import type { WorkflowActionHandler } from "./WorkflowActionHandler/WorkflowActionHandler";

export class WorkflowHandler implements ActionHandler {
    public readonly id = "Workflow";

    public constructor(
        private readonly logger: Logger,
        private readonly workflowActionHandlers: Record<string, WorkflowActionHandler>,
    ) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const workflowActions = WorkflowActionArgumentDecoder.decodeArgument(action.argument);

        const promises = workflowActions
            .filter((workflow) => Object.keys(this.workflowActionHandlers).includes(workflow.handlerId))
            .map((workflow) => this.workflowActionHandlers[workflow.handlerId].invokeWorkflowAction(workflow));

        const promiseResults = await Promise.allSettled(promises);

        for (const promiseResult of promiseResults) {
            if (promiseResult.status === "rejected") {
                this.logger.error(`Unable to invoke workflow action. Reason: ${promiseResult.reason}`);
            }
        }
    }
}
