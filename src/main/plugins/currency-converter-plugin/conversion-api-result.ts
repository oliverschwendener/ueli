interface ConversionApiResultDate {
    date: string;
}
interface ConversionApiResultValue {
    [key: string]: number;
}
export type ConversionApiResult = ConversionApiResultDate & ConversionApiResultValue;
