import type { WorkflowAction } from "@Shared/Extensions/Workflow";

export class WorkflowActionArgumentDecoder {
    public static decodeArgument(encodedArgument: string): WorkflowAction<unknown>[] {
        return JSON.parse(encodedArgument);
    }
}
