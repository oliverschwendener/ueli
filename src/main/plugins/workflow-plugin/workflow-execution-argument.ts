import { WorkflowExecutionArgumentType } from "./workflow-execution-argument-type";

export interface WorkflowExecutionArgument {
    executionArgument: string;
    executionArgumentType: WorkflowExecutionArgumentType;
}
