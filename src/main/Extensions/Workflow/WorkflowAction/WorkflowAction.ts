export type WorkflowAction<T> = {
    readonly handlerId: string;
    readonly args: T;
};
