import { WorkflowExecutionArgument } from "./workflow-execution-argument";
import { Icon } from "../../../common/icon/icon";

export interface Workflow {
    name: string;
    description: string;
    tags: string[];
    icon?: Icon;
    executionArguments: WorkflowExecutionArgument[];
}
