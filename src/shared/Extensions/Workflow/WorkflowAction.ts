export type WorkflowAction<T> = {
    readonly id: string;
    readonly handlerId: string;
    readonly name: string;
    readonly args: T;
};
