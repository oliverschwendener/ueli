import type { App } from "electron";
import { describe, expect, it, vi } from "vitest";
import { SingleInstaneLockModule } from "./SingleInstanceLockModule";

describe(SingleInstaneLockModule, () => {
    it("should request single instance lock", () => {
        const requestSingleInstanceLockMock = vi.fn().mockReturnValue(true);
        const quickMock = vi.fn();

        SingleInstaneLockModule.bootstrap(<App>{
            requestSingleInstanceLock: () => requestSingleInstanceLockMock(),
            quit: () => quickMock(),
        });

        expect(requestSingleInstanceLockMock).toHaveBeenCalledOnce();
        expect(quickMock).not.toHaveBeenCalled();
    });

    it("should quit the application if another instance is already running", () => {
        const requestSingleInstanceLockMock = vi.fn().mockReturnValue(false);

        const quickMock = vi.fn();

        SingleInstaneLockModule.bootstrap(<App>{
            requestSingleInstanceLock: () => requestSingleInstanceLockMock(),
            quit: () => quickMock(),
        });

        expect(requestSingleInstanceLockMock).toHaveBeenCalledOnce();
        expect(quickMock).toHaveBeenCalledOnce();
    });
});
