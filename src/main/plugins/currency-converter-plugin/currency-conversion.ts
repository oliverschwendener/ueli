import { CurrencyCode } from "./currency-code";

export interface CurrencyConversion {
    value: number;
    base: CurrencyCode;
    target: CurrencyCode;
}
