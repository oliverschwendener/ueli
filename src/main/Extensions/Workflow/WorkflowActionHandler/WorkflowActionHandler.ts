import type { WorkflowAction } from "@common/Extensions/Workflow";

export interface WorkflowActionHandler {
    invokeWorkflowAction(workflowAction: WorkflowAction<unknown>): Promise<void>;
}
