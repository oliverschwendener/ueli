import { describe, expect, it } from "vitest";
import { RowlyTextProcessor } from "./RowlyTextProcessor";

describe(RowlyTextProcessor, () => {
    describe(RowlyTextProcessor.prototype.split, () => {
        it("should return a single element on empty separator", () => {
            expect(new RowlyTextProcessor().split("Test\nTest", "")).toEqual(<string[]>[
                "Test\nTest",
            ]);
        });
        
        it("should return all elements on valid separators", () => {
            expect(new RowlyTextProcessor().split("Test\nTest\nTest3", "\n")).toEqual(<string[]>[
                "Test",
                "Test",
                "Test3",
            ]);
            expect(new RowlyTextProcessor().split("Test\tTest\tTest3", "\t")).toEqual(<string[]>[
                "Test",
                "Test",
                "Test3",
            ]);
            expect(new RowlyTextProcessor().split("Test$Test$Test3", "$")).toEqual(<string[]>[
                "Test",
                "Test",
                "Test3",
            ]);
            expect(new RowlyTextProcessor().split("Test$\nTest$\nTest3", "$\n")).toEqual(<string[]>[
                "Test",
                "Test",
                "Test3",
            ]);
            expect(new RowlyTextProcessor().split("TestTestTest3", "e")).toEqual(<string[]>[
                "T",
                "stT",
                "stT",
                "st3"
            ]);
        });
    });
});