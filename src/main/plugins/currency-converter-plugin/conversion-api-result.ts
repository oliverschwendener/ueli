export interface ConversionRate {
    [key: string]: number;
}

export interface ConversionApiResult {
    base: string;
    date: string;
    rates: ConversionRate;
}
