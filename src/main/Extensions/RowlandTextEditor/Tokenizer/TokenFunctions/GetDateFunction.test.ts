import { describe, expect, it } from "vitest";
import { GetDateFunction } from "./GetDateFunction";

describe(GetDateFunction, () => {
    describe(GetDateFunction.prototype.evaluate, () => {
        it("should return current date in iso format", () => {
            const result = new GetDateFunction().evaluate([]);
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        });

        it("should return current date in custom format", () => {
            expect(new GetDateFunction().evaluate(["yyyy/MM/dd"])).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
            expect(new GetDateFunction().evaluate(["dd-MM-yyyy"])).toMatch(/^\d{2}-\d{2}-\d{4}$/);
            expect(new GetDateFunction().evaluate(["HH:mm:ss"])).toMatch(/^\d{2}:\d{2}:\d{2}$/);
            expect(new GetDateFunction().evaluate(["dd.MM.yyyy HH:mm:ss.SSS"])).toMatch(
                /^\d{2}.\d{2}.\d{4} \d{2}:\d{2}:\d{2}.\d{3}$/,
            );
        });

        it("should ignore extra parameters", () => {
            expect(new GetDateFunction().evaluate(["yyyy/MM/dd", "extra"])).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
        });

        it("should handle non or partially replaced formats gracefully", () => {
            expect(new GetDateFunction().evaluate(["invalid"])).toEqual("invalid");
            expect(new GetDateFunction().evaluate(["HH o'clock"])).toMatch(/^\d{2} o'clock$/);
        });
    });
});
