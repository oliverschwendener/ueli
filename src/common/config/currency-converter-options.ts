export interface CurrencyConverterOptions {
    precision: number;
    isEnabled: boolean;
}

export const defaultCurrencyConverterOptions: CurrencyConverterOptions = {
    isEnabled: false,
    precision: 2,
};
