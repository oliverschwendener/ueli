import { CurrencyCode } from "../../main/plugins/currency-converter-plugin/currency-code";

export interface CurrencyConverterOptions {
    precision: number;
    defaultTarget: CurrencyCode;
    isEnabled: boolean;
}

export const defaultCurrencyConverterOptions: CurrencyConverterOptions = {
    isEnabled: false,
    precision: 2,
    defaultTarget: CurrencyCode.EUR
};
