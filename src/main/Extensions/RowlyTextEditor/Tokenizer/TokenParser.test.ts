import { describe, expect, it } from "vitest";
import { TokenParser } from "./TokenParser";
import type { TokenType } from "./TokenType";

describe(TokenParser, () => {
    describe(TokenParser.prototype.parse, () => {
        it("empty input should return empty array", () => {
            expect(new TokenParser("").parse()).toEqual(<TokenType[]>[]);
        });

        it("simple literal patterns", () => {
            expect(new TokenParser("Hello").parse()).toEqual(<TokenType[]>[{ type: "literal", value: "Hello" }]);
            expect(new TokenParser("Hello, World!").parse()).toEqual(<TokenType[]>[
                { type: "literal", value: "Hello, World!" },
            ]);
            expect(new TokenParser("$").parse()).toEqual(<TokenType[]>[{ type: "literal", value: "$" }]);
            expect(new TokenParser("$ TEST").parse()).toEqual(<TokenType[]>[
                { type: "literal", value: "$" },
                { type: "literal", value: " TEST" },
            ]);
            expect(new TokenParser("$_TEST").parse()).toEqual(<TokenType[]>[
                { type: "literal", value: "$" },
                { type: "literal", value: "_TEST" },
            ]);
            expect(new TokenParser("$$").parse()).toEqual(<TokenType[]>[{ type: "literal", value: "$" }]);
            expect(new TokenParser("$$ $$").parse()).toEqual(<TokenType[]>[
                { type: "literal", value: "$" },
                { type: "literal", value: " $" },
            ]);
            expect(new TokenParser("$$$$").parse()).toEqual(<TokenType[]>[{ type: "literal", value: "$$" }]);
            expect(new TokenParser("Hello $$123 $$$$").parse()).toEqual(<TokenType[]>[
                { type: "literal", value: "Hello $" },
                { type: "literal", value: "123 $$" },
            ]);
            expect(new TokenParser("I'm rich because I've 1886$$").parse()).toEqual(<TokenType[]>[
                { type: "literal", value: "I'm rich because I've 1886$" },
            ]);
            expect(new TokenParser("$$TEST()").parse()).toEqual(<TokenType[]>[
                { type: "literal", value: "$" },
                { type: "literal", value: "TEST()" },
            ]);
            expect(new TokenParser("test((hallowelt)").parse()).toEqual(<TokenType[]>[
                { type: "literal", value: "test((hallowelt)" },
            ]);
        });

        it("simple column patterns", () => {
            expect(new TokenParser("$0").parse()).toEqual(<TokenType[]>[{ type: "column", index: 0 }]);
            expect(new TokenParser("$1").parse()).toEqual(<TokenType[]>[{ type: "column", index: 1 }]);
            expect(new TokenParser("$1886").parse()).toEqual(<TokenType[]>[{ type: "column", index: 1886 }]);
            expect(new TokenParser("$0, $1").parse()).toEqual(<TokenType[]>[
                { type: "column", index: 0 },
                { type: "literal", value: ", " },
                { type: "column", index: 1 },
            ]);
        });

        it("simple function patterns", () => {
            expect(new TokenParser("$TODAY()").parse()).toEqual(<TokenType[]>[
                { type: "function", name: "TODAY", params: [] },
            ]);
            expect(new TokenParser("$TODAY(dd.MM.yyyy)").parse()).toEqual(<TokenType[]>[
                { type: "function", name: "TODAY", params: [[{ type: "literal", value: "dd.MM.yyyy" }]] },
            ]);
            expect(new TokenParser("$TODAY(dd.MM.yyyy))").parse()).toEqual(<TokenType[]>[
                { type: "function", name: "TODAY", params: [[{ type: "literal", value: "dd.MM.yyyy" }]] },
                { type: "literal", value: ")" },
            ]);
            expect(new TokenParser("$FUNCTION(test,bla)").parse()).toEqual(<TokenType[]>[
                {
                    type: "function",
                    name: "FUNCTION",
                    params: [[{ type: "literal", value: "test" }], [{ type: "literal", value: "bla" }]],
                },
            ]);
        });

        it("nested function patterns", () => {
            expect(new TokenParser("$OUTER($INNER())").parse()).toEqual(<TokenType[]>[
                { type: "function", name: "OUTER", params: [[{ type: "function", name: "INNER", params: [] }]] },
            ]);
            expect(new TokenParser("$OUTER($INNER($1886))").parse()).toEqual(<TokenType[]>[
                {
                    type: "function",
                    name: "OUTER",
                    params: [[{ type: "function", name: "INNER", params: [[{ type: "column", index: 1886 }]] }]],
                },
            ]);
            expect(new TokenParser("$OUTER($INNER(test))").parse()).toEqual(<TokenType[]>[
                {
                    type: "function",
                    name: "OUTER",
                    params: [[{ type: "function", name: "INNER", params: [[{ type: "literal", value: "test" }]] }]],
                },
            ]);
            expect(new TokenParser("$OUTER($INNER(test),hallo)").parse()).toEqual(<TokenType[]>[
                {
                    type: "function",
                    name: "OUTER",
                    params: [
                        [{ type: "function", name: "INNER", params: [[{ type: "literal", value: "test" }]] }],
                        [{ type: "literal", value: "hallo" }],
                    ],
                },
            ]);
            expect(new TokenParser("$OUTER($INNER(test),$OTHER(bla))").parse()).toEqual(<TokenType[]>[
                {
                    type: "function",
                    name: "OUTER",
                    params: [
                        [{ type: "function", name: "INNER", params: [[{ type: "literal", value: "test" }]] }],
                        [{ type: "function", name: "OTHER", params: [[{ type: "literal", value: "bla" }]] }],
                    ],
                },
            ]);
        });

        it("complex patterns", () => {
            expect(new TokenParser("Hello $0, today is $TODAY(dd.MM.yyyy).").parse()).toEqual(<TokenType[]>[
                { type: "literal", value: "Hello " },
                { type: "column", index: 0 },
                { type: "literal", value: ", today is " },
                { type: "function", name: "TODAY", params: [[{ type: "literal", value: "dd.MM.yyyy" }]] },
                { type: "literal", value: "." },
            ]);
        });

        it("should handle invalid patterns gracefully", () => {
            expect(() => new TokenParser("$TODAY(dd.MM.yyyy").parse()).toThrow("Unclosed function bracket");
            expect(() => new TokenParser("$(test)").parse()).toThrow("expected function name before '('");
            expect(() => new TokenParser("$OUTER($INNER(test)").parse()).toThrow("Unclosed function bracket");
            expect(() => new TokenParser("$OUTER(test,)").parse()).toThrow(
                "Empty parameter: trailing comma before ')'",
            );
            expect(() => new TokenParser("$OUTER(($INNER(test))").parse()).toThrow("Unmatched '('");
        });
    });
});
