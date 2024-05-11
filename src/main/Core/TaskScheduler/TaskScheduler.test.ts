import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TaskScheduler } from "./TaskScheduler";

describe(TaskScheduler, () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("scheduleTask", () => {
        it("should schedule a task after the given duration", () => {
            const task = vi.fn();

            const taskScheduler = new TaskScheduler();

            taskScheduler.scheduleTask(task, 1000);

            expect(task).not.toHaveBeenCalled();

            vi.advanceTimersByTime(1000);

            expect(task).toHaveBeenCalledOnce();
        });
    });

    describe("abortTask", () => {
        it("should abort the scheduled task", () => {
            const task = vi.fn();

            const taskScheduler = new TaskScheduler();

            const cancellationToken = taskScheduler.scheduleTask(task, 1000);

            expect(task).not.toHaveBeenCalled();

            taskScheduler.abortTask(cancellationToken);

            vi.advanceTimersByTime(1000);

            expect(task).not.toHaveBeenCalled();
        });
    });
});
