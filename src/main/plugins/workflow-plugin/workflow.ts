import { WorkflowExecutionStep } from "./workflow-execution-argument";
import { Icon } from "../../../common/icon/icon";

export interface Workflow {
    name: string;
    description: string;
    tags: string[];
    icon: Icon;
    executionSteps: WorkflowExecutionStep[];
    needsUserConfirmationBeforeExecution: boolean;
}
