import type { TaskScheduler as TaskSchedulerInterface } from "./Contract";

export class TaskScheduler implements TaskSchedulerInterface {
    public scheduleTask(task: () => void, waitDurationInMs: number): NodeJS.Timeout {
        return setTimeout(task, waitDurationInMs);
    }

    public abortTask(cancellationToken: NodeJS.Timeout): void {
        clearTimeout(cancellationToken);
    }
}
