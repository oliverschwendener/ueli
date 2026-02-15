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
            expect(new RowlandTextProcessor().split("Test$Test$Test3", "$")).toEqual(<string[]>[
                "Test",
                "Test",
                "Test3",
            ]);
            expect(new RowlandTextProcessor().split("Test$\nTest$\nTest3", "$\n")).toEqual(<string[]>[
                "Test",
                "Test",
                "Test3",
            ]);
            expect(new RowlandTextProcessor().split("TestTestTest3", "e")).toEqual(<string[]>[
                "T",
                "stT",
                "stT",
                "st3",
            ]);
        });
    });

    describe(RowlandTextProcessor.prototype.unescape, () => {
        it("should unescape common escape sequences", () => {
            expect(new RowlandTextProcessor().unescape("\\n")).toEqual("\n");
            expect(new RowlandTextProcessor().unescape("\\t")).toEqual("\t");
            expect(new RowlandTextProcessor().unescape("\\r")).toEqual("\r");
            expect(new RowlandTextProcessor().unescape("\\\\")).toEqual("\\");
        });

        it("should not modify strings without escape sequences", () => {
            expect(new RowlandTextProcessor().unescape("Test")).toEqual("Test");
        });

        it("should unescape multiple escape sequences in a string", () => {
            expect(new RowlandTextProcessor().unescape("Line1\\nLine2\\tTabbed\\\\Backslash")).toEqual(
                "Line1\nLine2\tTabbed\\Backslash",
            );
        });
    });

    describe(RowlandTextProcessor.prototype.process, () => {
        it("should process input according to pattern", () => {
            expect(new RowlandTextProcessor().process("Hello\tWorld\nFoo\tBar", "$0 $1", "\\n", "\\t")).toEqual(
                "Hello World\nFoo Bar",
            );
            expect(new RowlandTextProcessor().process("123\t456", '$0 = "$0"', "\\n", "\\t")).toEqual('123 = "123"');
            expect(
                new RowlandTextProcessor().process(
                    "1234,Test",
                    "INSERT INTO MyTestTable(Id, Number, Name, CreationDate) VALUES ('$UUID()', $0, '$1', '$GETDATE()')",
                    "\\n",
                    ",",
                ),
            ).toMatch(
                /^INSERT INTO MyTestTable\(Id, Number, Name, CreationDate\) VALUES \('([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', 1234, 'Test', '\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z'\)$/,
            );
        });

        it("should handle errors gracefully", () => {
            expect(new RowlandTextProcessor().process("Test", "$UNKNOWNFUNC()", "\\n", "\\t")).toMatch(
                /Unknown function: UNKNOWNFUNC/,
            );
        });
    });
});
