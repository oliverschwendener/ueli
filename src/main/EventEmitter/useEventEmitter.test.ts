import type { Emitter } from "mitt";
import { describe, expect, it } from "vitest";
import { MittEventEmitter } from "./MittEventEmitter";
import { useEventEmitter } from "./useEventEmitter";

describe(useEventEmitter, () => {
    it("should return an instance of MittEventEmitter", () => {
        const emitter = <Emitter<Record<string, unknown>>>{};
        expect(useEventEmitter({ emitter })).toEqual(new MittEventEmitter(emitter));
    });
});
