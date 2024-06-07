import type { WorkflowAction } from "@common/Extensions/Workflow";

export class WorkflowActionArgumentDecoder {
    public static decodeArgument(encodedArgument: string): WorkflowAction<unknown>[] {
        return JSON.parse(encodedArgument);
    }
}
