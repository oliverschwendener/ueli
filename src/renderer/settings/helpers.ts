import { WorkflowExecutionArgumentType } from "../../main/plugins/workflow-plugin/workflow-execution-argument-type";
import { TranslationSet } from "../../common/translation/translation-set";

export function getWorkflowExecutionArgumentTypeIcon(type: WorkflowExecutionArgumentType): string {
    switch (type) {
        case WorkflowExecutionArgumentType.URL:
            return "fas fa-globe-europe";
        case WorkflowExecutionArgumentType.FilePath:
            return "fas fa-file";
        case WorkflowExecutionArgumentType.CommandlineTool:
            return "fas fa-terminal";
    }
}

export function getWorkflowExecutionArgumentTypeClass(type: WorkflowExecutionArgumentType): string {
    switch (type) {
        case WorkflowExecutionArgumentType.URL:
            return "is-primary";
        case WorkflowExecutionArgumentType.FilePath:
            return "is-info";
        case WorkflowExecutionArgumentType.CommandlineTool:
            return "is-link";
        default:
            return "is-light";
    }
}

export function getWorkflowExecutionArgumentTypeTranslation(
    type: WorkflowExecutionArgumentType,
    translationSet: TranslationSet,
): string {
    switch (type) {
        case WorkflowExecutionArgumentType.CommandlineTool:
            return translationSet.workflowExecutionArgumentTypeCommandlineTool;
        case WorkflowExecutionArgumentType.FilePath:
            return translationSet.filePath;
        case WorkflowExecutionArgumentType.URL:
            return translationSet.workflowExecutionArgumentTypeUrl;
    }
}
