import type { WorkflowAction } from "@Shared/Extensions/Workflow";

export interface WorkflowActionHandler {
    invokeWorkflowAction(workflowAction: WorkflowAction<unknown>): Promise<void>;
}
