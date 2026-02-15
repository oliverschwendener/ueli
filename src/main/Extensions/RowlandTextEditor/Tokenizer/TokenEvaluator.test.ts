import { describe, expect, it } from "vitest";
import { TokenEvaluator } from "./TokenEvaluator";

describe(TokenEvaluator, () => {
    describe(TokenEvaluator.prototype.evaluate, () => {
        it("evaluate literals", () => {
            expect(new TokenEvaluator().evaluate([{ type: "literal", value: "test test" }], [])).toEqual("test test");
            expect(new TokenEvaluator().evaluate([{ type: "literal", value: "$ILookLikeAFunc(,)" }], [])).toEqual(
                "$ILookLikeAFunc(,)",
            );
        });

        it("evaluate columns", () => {
            expect(new TokenEvaluator().evaluate([{ type: "column", index: 0 }], ["test"])).toEqual("test");
            expect(new TokenEvaluator().evaluate([{ type: "column", index: 1 }], ["test"])).toEqual("");
            expect(new TokenEvaluator().evaluate([{ type: "column", index: 0 }], [])).toEqual("");
        });

        it("evaluate functions", () => {
            expect(new TokenEvaluator().evaluate([{ type: "function", name: "GETDATE", params: [] }], [])).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
            );
            expect(new TokenEvaluator().evaluate([{ type: "function", name: "gEtDaTe", params: [] }], [])).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
            );
            expect(
                new TokenEvaluator().evaluate(
                    [{ type: "function", name: "GETDATE", params: [[{ type: "literal", value: "yyyy/MM/dd" }]] }],
                    [],
                ),
            ).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
            expect(
                new TokenEvaluator().evaluate(
                    [{ type: "function", name: "GETDATE", params: [[{ type: "column", index: 0 }]] }],
                    ["HH:mm:ss"],
                ),
            ).toMatch(/^\d{2}:\d{2}:\d{2}$/);
        });

        it("evaluate unknown function throws error", () => {
            expect(() =>
                new TokenEvaluator().evaluate([{ type: "function", name: "UNKNOWNFUNC", params: [] }], []),
            ).toThrow("Unknown function: UNKNOWNFUNC");
        });

        it("evaluate complex expression", () => {
            expect(
                new TokenEvaluator().evaluate(
                    [
                        { type: "literal", value: "Today is " },
                        { type: "function", name: "GETDATE", params: [[{ type: "literal", value: "yyyy/MM/dd" }]] },
                    ],
                    [],
                ),
            ).toMatch(/^Today is \d{4}\/\d{2}\/\d{2}$/);

            expect(
                new TokenEvaluator().evaluate(
                    [
                        { type: "literal", value: "INSERT INTO TABLE(ID, CREATIONDATE, NAME) VALUES(" },
                        { type: "column", index: 0 },
                        { type: "literal", value: ", '" },
                        {
                            type: "function",
                            name: "GETDATE",
                            params: [[{ type: "literal", value: "yyyy-MM-dd HH:mm:ss" }]],
                        },
                        { type: "literal", value: "', '" },
                        { type: "column", index: 1 },
                        { type: "literal", value: "');" },
                    ],
                    ["123", "Test"],
                ),
            ).toMatch(
                /^INSERT INTO TABLE\(ID, CREATIONDATE, NAME\) VALUES\(123, '\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}', 'Test'\);$/,
            );
        });
    });
});
