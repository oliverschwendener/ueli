import { describe, expect, it } from "vitest";
import { RandomStringProvider } from "./RandomStringProvider";

describe(RandomStringProvider, () => {
    describe(RandomStringProvider.prototype.getRandomUUid, () => {
        it("should not return the same string twice", () => {
            const randomStringProvider = new RandomStringProvider();
            expect(randomStringProvider.getRandomUUid()).not.toEqual(randomStringProvider.getRandomUUid());
        });
    });
});
