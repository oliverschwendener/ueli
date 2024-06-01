import type { WorkflowAction } from "./WorkflowAction";

export class OpenFileWorkflowAction implements WorkflowAction {
    public readonly handlerId = "OpenFile";

    public constructor(public readonly filePath: string) {}
}
