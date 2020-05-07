export interface CurrencyConverterOptions {
    precision: number;
    isEnabled: boolean;
    separator:string;
}

export const defaultCurrencyConverterOptions: CurrencyConverterOptions = {
    isEnabled: false,
    precision: 2,
    separator:","
};
