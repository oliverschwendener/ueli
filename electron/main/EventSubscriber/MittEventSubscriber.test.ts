import type { Emitter } from "mitt";
import { describe, expect, it, vi } from "vitest";
import { MittEventSubscriber } from "./MittEventSubscriber";

describe(MittEventSubscriber, () => {
    it("should call the emitter's on function", () => {
        const emitEventMock = vi.fn();

        const emitter = <Emitter<Record<string, unknown>>>{
            on: (eventName: string, eventHandler: () => void) => emitEventMock(eventName, eventHandler),
        };

        const eventHandler = () => null;

        new MittEventSubscriber(emitter).subscribe("testEvent", eventHandler);
        expect(emitEventMock).toHaveBeenCalledWith("testEvent", eventHandler);
    });
});
