import { WorkflowExecutionArgumentType } from "./workflow-execution-argument-type";

export interface WorkflowExecutionStep {
    executionArgument: string;
    executionArgumentType: WorkflowExecutionArgumentType;
}
