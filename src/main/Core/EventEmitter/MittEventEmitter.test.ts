import type { Emitter } from "mitt";
import { describe, expect, it, vi } from "vitest";
import { MittEventEmitter } from "./MittEventEmitter";

describe(MittEventEmitter, () => {
    it("should call the emitter's emitEvent function", () => {
        const emitEventMock = vi.fn();

        const emitter = <Emitter<Record<string, unknown>>>{
            emit: (eventName: string) => emitEventMock(eventName),
        };

        new MittEventEmitter(emitter).emitEvent("testEvent");

        expect(emitEventMock).toHaveBeenCalledWith("testEvent");
    });
});
