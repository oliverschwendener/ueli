import type { WorkflowAction } from "./WorkflowAction";

export class WorkflowActionArgumentEncoder {
    public static encodeArgument(workflowActions: WorkflowAction[]): string {
        return JSON.stringify(workflowActions);
    }
}
