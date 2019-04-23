import { WorkflowExecutionArgument } from "./workflow-execution-argument";

export interface Workflow {
    name: string;
    description: string;
    tags: string[];
    asnyc: boolean;
    executionArguments: WorkflowExecutionArgument[];
}
