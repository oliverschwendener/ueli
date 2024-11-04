import { describe, expect, it } from "vitest";
import { convert } from "./convert";
import type { Rates } from "./Rates";

describe(convert, () => {
    it("should convert the base currency to the target according to the rates", () => {
        const rates: Rates = {
            chf: {
                usd: 2,
                eur: 0.5,
            },
            usd: {
                chf: 0.5,
                eur: 0.25,
            },
        };

        expect(convert({ base: "CHF", rates, target: "USD", value: 1 })).toEqual({ result: 2, target: "USD" });
        expect(convert({ base: "CHF", rates, target: "EUR", value: 10 })).toEqual({ result: 5, target: "EUR" });
    });

    it("should throw an error if the base currency is not found", () => {
        expect(() => convert({ base: "CHF", rates: { usd: { chf: 0.5 } }, target: "USD", value: 1 })).toThrowError(
            "Base currency not found",
        );
    });

    it("should throw an error if the target currency is not found", () => {
        expect(() => convert({ base: "CHF", rates: { chf: { eur: 0.5 } }, target: "USD", value: 1 })).toThrowError(
            "Target currency not found",
        );
    });
});
