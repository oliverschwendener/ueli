export interface TaskScheduler {
    scheduleTask(task: () => void, waitDurationInMs: number): void;
    abortTask(cancellationToken: NodeJS.Timeout): void;
}
