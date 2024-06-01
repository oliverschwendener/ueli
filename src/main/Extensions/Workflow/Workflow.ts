import type { WorkflowAction } from "./WorkflowAction";

export type Workflow = {
    readonly id: string;
    readonly name: string;
    readonly actions: WorkflowAction<unknown>[];
};
