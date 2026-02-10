import { describe, expect, it } from "vitest";
import { RowlandTextProcessor } from "./RowlandTextProcessor";

describe(RowlandTextProcessor, () => {
    describe(RowlandTextProcessor.prototype.split, () => {
        it("should return a single element on empty separator", () => {
            expect(new RowlandTextProcessor().split("Test\nTest", "")).toEqual(<string[]>["Test\nTest"]);
        });

        it("should return all elements on valid separators", () => {
            expect(new RowlandTextProcessor().split("Test\nTest\nTest3", "\n")).toEqual(<string[]>[
                "Test",
                "Test",
                "Test3",
            ]);
            expect(new RowlandTextProcessor().split("Test\tTest\tTest3", "\t")).toEqual(<string[]>[
                "Test",
                "Test",
                "Test3",
            ]);
            expect(new RowlandTextProcessor().split("Test$Test$Test3", "$")).toEqual(<string[]>["Test", "Test", "Test3"]);
            expect(new RowlandTextProcessor().split("Test$\nTest$\nTest3", "$\n")).toEqual(<string[]>[
                "Test",
                "Test",
                "Test3",
            ]);
            expect(new RowlandTextProcessor().split("TestTestTest3", "e")).toEqual(<string[]>["T", "stT", "stT", "st3"]);
        });
    });
});
