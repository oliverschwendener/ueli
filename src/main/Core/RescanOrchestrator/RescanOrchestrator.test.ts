import type { EventEmitter } from "@Core/EventEmitter";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TaskScheduler } from "@Core/TaskScheduler";
import { describe, expect, it, vi } from "vitest";
import { RescanOrchestrator } from "./RescanOrchestrator";

describe(RescanOrchestrator, () => {
    describe("cancel", () => {
        it("should cancel the next rescan if cancellation token is set", () => {
            const getValueMock = vi.fn().mockReturnValue(300);

            const eventEmitter = <EventEmitter>{ emitEvent: vi.fn() };
            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

            const taskScheduler = <TaskScheduler>{
                scheduleTask: vi.fn().mockReturnValue(1),
                abortTask: vi.fn(),
            };

            const rescanOrchestrator = new RescanOrchestrator(eventEmitter, settingsManager, taskScheduler);

            rescanOrchestrator.scanUntilCancelled();
            rescanOrchestrator.cancel();

            expect(getValueMock).toHaveBeenCalledWith("general.rescanIntervalInSeconds", 300);
            expect(eventEmitter.emitEvent).toHaveBeenCalledWith("RescanOrchestrator:timeElapsed");
            expect(taskScheduler.scheduleTask).toHaveBeenCalledWith(expect.any(Function), 300 * 1000);
            expect(taskScheduler.abortTask).toHaveBeenCalledWith(1);
        });

        it("should do nothing when the cancellation token is not set", () => {
            const taskScheduler = <TaskScheduler>{
                scheduleTask: vi.fn().mockReturnValue(1),
                abortTask: vi.fn(),
            };

            const rescanOrchestrator = new RescanOrchestrator(<EventEmitter>{}, <SettingsManager>{}, taskScheduler);

            rescanOrchestrator.cancel();

            expect(taskScheduler.abortTask).not.toHaveBeenCalled();
        });
    });

    describe("scanUntilCancelled", () => {
        it("should emit the timeElapsed event and schedule the next scan", () => {
            // TODO: Implement this test
        });
    });
});
