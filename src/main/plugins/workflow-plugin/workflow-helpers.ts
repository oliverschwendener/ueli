import { WorkflowExecutionStep } from "./workflow-execution-argument";
import { WorkflowExecutionArgumentType } from "./workflow-execution-argument-type";
import { existsSync } from "fs";
import { isValidUrl } from "../../../common/helpers/url-helpers";
import { Workflow } from "./workflow";
import { isArray } from "util";
import { isValidIcon } from "../../../common/icon/icon-helpers";

export function isValidWorkflow(workflow: Workflow): boolean {
    return (
        workflow.name.length > 0 &&
        isValidIcon(workflow.icon) &&
        workflow.executionSteps.length > 0 &&
        !workflow.executionSteps.some((executionStep) => !isValidExecutionStep(executionStep)) &&
        isArray(workflow.tags)
    );
}

export function isValidExecutionStep(executionStep: WorkflowExecutionStep): boolean {
    switch (executionStep.executionArgumentType) {
        case WorkflowExecutionArgumentType.FilePath:
            return isValidExecutionStepFilePath(executionStep.executionArgument);
        case WorkflowExecutionArgumentType.CommandlineTool:
            return isValidExecutionStepCommandlineTool(executionStep.executionArgument);
        case WorkflowExecutionArgumentType.URL:
            return isValidUrl(executionStep.executionArgument);
        default:
            return false;
    }
}

function isValidExecutionStepFilePath(filePath: string): boolean {
    return existsSync(filePath);
}

function isValidExecutionStepCommandlineTool(command: string): boolean {
    return command.length > 0;
}
