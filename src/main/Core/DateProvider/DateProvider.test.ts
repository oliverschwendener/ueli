import { describe, expect, it } from "vitest";
import { DateProvider } from "./DateProvider";

describe(DateProvider, () => {
    describe(DateProvider.prototype.get, () => {
        it("should return the current date", () => {
            const currentDate = new Date();

            const actual = new DateProvider().get().getUTCSeconds();

            // To prevent timing issues this test checks if the actual date is within a range of a second.
            const acceptedRange = {
                min: currentDate.getUTCSeconds() - 0.5,
                max: currentDate.getUTCSeconds() + 0.5,
            };

            expect(actual).toBeGreaterThan(acceptedRange.min);
            expect(actual).toBeLessThan(acceptedRange.max);
        });
    });
});
