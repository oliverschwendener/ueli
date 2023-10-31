import type { Emitter } from "mitt";
import { describe, expect, it } from "vitest";
import { MittEventSubscriber } from "./MittEventSubscriber";
import { useEventSubscriber } from "./useEventSubscriber";

describe(useEventSubscriber, () => {
    it("should return an instance of MittEventSubscriber", () => {
        const emitter = <Emitter<Record<string, unknown>>>{};
        expect(useEventSubscriber({ emitter })).toEqual(new MittEventSubscriber(emitter));
    });
});
