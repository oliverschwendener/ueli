import { expect } from "chai";
import { TimeHelpers } from "../../../src/ts/helpers/time-helpers";

describe(TimeHelpers.name, (): void => {
    describe(TimeHelpers.convertSecondsToMilliseconds.name, (): void => {
        it("should convert seconds to milliseconds correctly", (): void => {
            let seconds = 30;
            let expectedMilliseconds = 30000;

            let actual = TimeHelpers.convertSecondsToMilliseconds(seconds);
            expect(actual).to.equal(expectedMilliseconds);
        });
    });
});