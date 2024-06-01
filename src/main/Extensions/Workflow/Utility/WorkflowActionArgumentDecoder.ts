import type { WorkflowAction } from "../WorkflowAction";

export class WorkflowActionArgumentDecoder {
    public static decodeArgument(encodedArgument: string): WorkflowAction<unknown>[] {
        return JSON.parse(encodedArgument);
    }
}
