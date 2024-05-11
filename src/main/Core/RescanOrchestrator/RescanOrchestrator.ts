import type { EventEmitter } from "@Core/EventEmitter";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TaskScheduler } from "@Core/TaskScheduler";

export class RescanOrchestrator {
    private cancellationToken?: NodeJS.Timeout = undefined;

    public constructor(
        private readonly eventEmitter: EventEmitter,
        private readonly settingsManager: SettingsManager,
        private readonly taskScheduler: TaskScheduler,
    ) {}

    public scanUntilCancelled(): void {
        this.eventEmitter.emitEvent("RescanOrchestrator:timeElapsed");

        this.cancellationToken = this.taskScheduler.scheduleTask(
            () => this.scanUntilCancelled(),
            this.getRescanDurationInSeconds() * 1000,
        );
    }

    public cancel(): void {
        if (this.cancellationToken) {
            this.taskScheduler.abortTask(this.cancellationToken);
        }
    }

    private getRescanDurationInSeconds(): number {
        const defaultRescanDurationInSeconds = 60;

        const rescanDurationInSeconds = this.settingsManager.getValue(
            "searchEngine.rescanIntervalInSeconds",
            defaultRescanDurationInSeconds,
        );

        return rescanDurationInSeconds < 10 ? defaultRescanDurationInSeconds : rescanDurationInSeconds;
    }
}
