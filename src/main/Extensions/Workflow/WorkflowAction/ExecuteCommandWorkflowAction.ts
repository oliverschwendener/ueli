import type { WorkflowAction } from "./WorkflowAction";

export class ExecuteCommandWorkflowAction implements WorkflowAction {
    public readonly handlerId = "ExecuteCommand";

    public constructor(public readonly command: string) {}
}
