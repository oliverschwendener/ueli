import { getRescanIntervalInMilliseconds } from "./rescan-interval-helpers";

describe(getRescanIntervalInMilliseconds.name, () => {
    const rescanIntervalsInSeconds = [0, 5, 10, 30, 1000, 12341.1234];

    it("should correctly convert seconds to milliseconds", () => {
        rescanIntervalsInSeconds.forEach((rescanIntervalInSeconds) => {
            const expected = rescanIntervalInSeconds * 1000;
            const actual = getRescanIntervalInMilliseconds(rescanIntervalInSeconds);
            expect(actual).toBe(expected);
        });
    });

    it("should use the specified default value if value is less than specified minimum", () => {
        const minimum = 20;

        rescanIntervalsInSeconds.forEach((rescanIntervalInSeconds) => {
            const expected = rescanIntervalInSeconds < minimum ? minimum * 1000 : rescanIntervalInSeconds * 1000;

            const actual = getRescanIntervalInMilliseconds(rescanIntervalInSeconds, minimum);

            expect(actual).toBe(expected);
        });
    });
});
