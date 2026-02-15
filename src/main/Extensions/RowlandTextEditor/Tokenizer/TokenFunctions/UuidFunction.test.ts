import { describe, expect, it } from "vitest";
import { UuidFunction } from "./UuidFunction";

describe(UuidFunction, () => {
    describe(UuidFunction.prototype.evaluate, () => {
        it("should return a valid UUID in default format", () => {
            expect(new UuidFunction().evaluate([])).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
            );
        });

        it("should return a valid UUID in N format", () => {
            expect(new UuidFunction().evaluate(["N"])).toMatch(/^[0-9a-f]{32}$/i);
        });

        it("should return a valid UUID in B format", () => {
            expect(new UuidFunction().evaluate(["B"])).toMatch(
                /^\{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}$/i,
            );
        });

        it("should return a valid UUID in P format", () => {
            expect(new UuidFunction().evaluate(["P"])).toMatch(
                /^\([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\)$/i,
            );
        });

        it("should return a valid UUID in v6 format", () => {
            expect(new UuidFunction().evaluate(["D", "v6"])).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
            );
        });

        it("should return a valid UUID in v7 format", () => {
            expect(new UuidFunction().evaluate(["D", "v7"])).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
            );
        });

        it("should ignore extra parameters", () => {
            expect(new UuidFunction().evaluate(["N", "v4", "extra"])).toMatch(/^[0-9a-f]{32}$/i);
        });
    });
});
