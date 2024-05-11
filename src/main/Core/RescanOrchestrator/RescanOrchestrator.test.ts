import type { EventEmitter } from "@Core/EventEmitter";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TaskScheduler } from "@Core/TaskScheduler";
import { describe, expect, it, vi } from "vitest";
import { RescanOrchestrator } from "./RescanOrchestrator";

describe(RescanOrchestrator, () => {
    describe("cancel", () => {
        it("should cancel the next rescan if cancellation token is set", () => {
            const eventEmitter = <EventEmitter>{ emitEvent: vi.fn() };

            const settingsManager = <SettingsManager>{
                getValue: vi.fn().mockReturnValue(20),
                updateValue: vi.fn(),
            };

            const taskScheduler = <TaskScheduler>{
                scheduleTask: vi.fn().mockReturnValue(1),
                abortTask: vi.fn(),
            };

            const rescanOrchestrator = new RescanOrchestrator(eventEmitter, settingsManager, taskScheduler);

            rescanOrchestrator.scanUntilCancelled();
            rescanOrchestrator.cancel();

            expect(settingsManager.getValue).toHaveBeenCalledWith("searchEngine.rescanIntervalInSeconds", 60);
            expect(eventEmitter.emitEvent).toHaveBeenCalledWith("RescanOrchestrator:timeElapsed");
            expect(taskScheduler.scheduleTask).toHaveBeenCalledWith(expect.any(Function), 20 * 1000);
            expect(taskScheduler.abortTask).toHaveBeenCalledWith(1);
        });

        it("should do nothing when the cancellation token is not set", () => {
            const taskScheduler = <TaskScheduler>{
                scheduleTask: vi.fn().mockReturnValue(1),
                abortTask: vi.fn(),
            };

            new RescanOrchestrator(<EventEmitter>{}, <SettingsManager>{}, taskScheduler).cancel();

            expect(taskScheduler.abortTask).not.toHaveBeenCalled();
        });
    });

    describe("scanUntilCancelled", () => {
        it("should emit the timeElapsed event and schedule the next scan", () => {
            const eventEmitter = <EventEmitter>{ emitEvent: vi.fn() };

            const settingsManager = <SettingsManager>{
                getValue: vi.fn().mockReturnValue(40),
                updateValue: vi.fn(),
            };

            const taskScheduler = <TaskScheduler>{
                scheduleTask: vi.fn().mockReturnValue(1),
                abortTask: vi.fn(),
            };

            new RescanOrchestrator(eventEmitter, settingsManager, taskScheduler).scanUntilCancelled();

            expect(eventEmitter.emitEvent).toHaveBeenCalledWith("RescanOrchestrator:timeElapsed");
            expect(settingsManager.getValue).toHaveBeenCalledWith("searchEngine.rescanIntervalInSeconds", 60);
            expect(taskScheduler.scheduleTask).toHaveBeenCalledWith(expect.any(Function), 40000);
        });

        it("should use the default rescan duration when the configured value is under 10 seconds", () => {
            const eventEmitter = <EventEmitter>{ emitEvent: vi.fn() };

            const settingsManager = <SettingsManager>{
                getValue: vi.fn().mockReturnValue(9),
                updateValue: vi.fn(),
            };

            const taskScheduler = <TaskScheduler>{
                scheduleTask: vi.fn().mockReturnValue(1),
                abortTask: vi.fn(),
            };

            new RescanOrchestrator(eventEmitter, settingsManager, taskScheduler).scanUntilCancelled();

            expect(eventEmitter.emitEvent).toHaveBeenCalledWith("RescanOrchestrator:timeElapsed");
            expect(settingsManager.getValue).toHaveBeenCalledWith("searchEngine.rescanIntervalInSeconds", 60);
            expect(taskScheduler.scheduleTask).toHaveBeenCalledWith(expect.any(Function), 60000);
        });
    });
});
