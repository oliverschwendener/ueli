import type { WorkflowAction } from "./WorkflowAction";

export class WorkflowActionArgumentDecoder {
    public static decodeArgument(encodedArgument: string): WorkflowAction[] {
        return JSON.parse(encodedArgument);
    }
}
