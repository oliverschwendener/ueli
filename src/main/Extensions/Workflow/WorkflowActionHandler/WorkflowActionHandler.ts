export interface WorkflowActionHandler<T> {
    invokeWorkflowAction(workflowAction: T): Promise<void>;
}
