import { expect } from "chai";
import { TimeHelpers } from "../../../ts/helpers/time-helpers";

describe(TimeHelpers.name, (): void => {
    describe(TimeHelpers.convertSecondsToMilliseconds.name, (): void => {
        it("should convert seconds to milliseconds correctly", (): void => {
            const seconds = 30;
            const expectedMilliseconds = 30000;

            const actual = TimeHelpers.convertSecondsToMilliseconds(seconds);
            expect(actual).to.equal(expectedMilliseconds);
        });
    });
});
