import type { WorkflowAction } from "./WorkflowAction";

export class OpenUrlWorkflowAction implements WorkflowAction {
    public readonly handlerId = "OpenUrl";

    public constructor(public readonly url: string) {}
}
