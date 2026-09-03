import type { WorkflowAction } from "@Shared/Extensions/Workflow";

export class WorkflowActionArgumentEncoder {
    public static encodeArgument(workflowActions: WorkflowAction<unknown>[]): string {
        return JSON.stringify(workflowActions);
    }
}
