import type { WorkflowAction } from "../WorkflowAction/WorkflowAction";

export interface WorkflowActionHandler {
    invokeWorkflowAction(workflowAction: WorkflowAction<unknown>): Promise<void>;
}
