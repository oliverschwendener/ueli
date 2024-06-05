import { describe, expect, it } from "vitest";
import { ScanCounter } from "./ScanCounter";

describe(ScanCounter, () => {
    describe(ScanCounter.prototype.increment, () => {
        it("should increment the scan count", () => {
            const scanCounter = new ScanCounter(17);
            scanCounter.increment();
            scanCounter.increment();
            scanCounter.increment();
            expect(scanCounter["scanCount"]).toBe(20);
        });
    });

    describe(ScanCounter.prototype.getScanCount, () =>
        it("should increment the scan count", () => expect(new ScanCounter(3123).getScanCount()).toBe(3123)),
    );
});
