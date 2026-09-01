import type { WorkflowAction } from "@shared/Extensions/Workflow";

export interface WorkflowActionHandler {
    invokeWorkflowAction(workflowAction: WorkflowAction<unknown>): Promise<void>;
}
