import type { AssetPathResolver } from "@Core/AssetPathResolver";
import { describe, expect, it, vi } from "vitest";
import { CurrencyConversion } from "./CurrencyConversion";
import type { Rates } from "./Rates";

describe(CurrencyConversion, () => {
    describe(CurrencyConversion.prototype.getInstantSearchResultItems, () => {
        const testSuccessfulConversion = ({
            expectedResult,
            userInput,
            rates,
        }: {
            expectedResult: string;
            userInput: string;
            rates: Rates;
        }) => {
            const imageFilePath = "/path/to/image";
            const getExtensionAssetPathMock = vi.fn().mockReturnValue(imageFilePath);

            const assetPathResolver = <AssetPathResolver>{
                getExtensionAssetPath: (i, f) => getExtensionAssetPathMock(i, f),
                getModuleAssetPath: () => null,
            };

            const currencyConversion = new CurrencyConversion(null, null, assetPathResolver);

            currencyConversion["rates"] = rates;

            const actual = currencyConversion.getInstantSearchResultItems(userInput);

            expect(actual[0].name).toEqual(expectedResult);
            expect(actual[0].image).toEqual({ url: `file://${imageFilePath}` });
            expect(getExtensionAssetPathMock).toHaveBeenCalledWith(currencyConversion.id, "currency-conversion.png");
        };

        it("should return empty array when user input does not contain 4 parts", () => {
            const currencyConversion = new CurrencyConversion(null, null, null);

            currencyConversion["rates"] = { chf: { usd: 2 } };

            expect(currencyConversion.getInstantSearchResultItems("1 CHF to")).toEqual([]);
        });

        it("should return empty array when first part in user input is not numerical", () => {
            const currencyConversion = new CurrencyConversion(null, null, null);

            currencyConversion["rates"] = { chf: { usd: 2 } };

            expect(currencyConversion.getInstantSearchResultItems("abc CHF to USD")).toEqual([]);
        });

        it("should return empty array when base currency does not exist", () => {
            const currencyConversion = new CurrencyConversion(null, null, null);

            currencyConversion["rates"] = { chf: { usd: 2 } };

            expect(currencyConversion.getInstantSearchResultItems("1 EUR to USD")).toEqual([]);
        });

        it("should return empty array when second part of user input is not 'in' or 'to'", () => {
            const currencyConversion = new CurrencyConversion(null, null, null);

            currencyConversion["rates"] = { chf: { usd: 2 } };

            expect(currencyConversion.getInstantSearchResultItems("1 CHF inn USD")).toEqual([]);
            expect(currencyConversion.getInstantSearchResultItems("1 CHF t USD")).toEqual([]);
        });

        it("should return empty array when target currency is not found", () => {
            const currencyConversion = new CurrencyConversion(null, null, null);

            currencyConversion["rates"] = { chf: { usd: 2 } };

            expect(currencyConversion.getInstantSearchResultItems("1 CHF to EUR")).toEqual([]);
        });

        it("should convert currencies based on the rates when user input matches expected pattern", () => {
            const rates: Rates = { chf: { usd: 2, eur: 0.5 } };

            testSuccessfulConversion({ expectedResult: "2.00 USD", userInput: "1 CHF to USD", rates });
            testSuccessfulConversion({ expectedResult: "0.50 EUR", userInput: "1 CHF in EUR", rates });
        });
    });
});
