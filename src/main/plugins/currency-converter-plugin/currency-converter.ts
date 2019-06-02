import axios from "axios";
import { CurrencyConversion } from "./currency-conversion";
import { ConversionApiResult } from "./conversion-api-result";

export class CurrencyConverter {
    public static async convert(conversion: CurrencyConversion, precision: number): Promise<number|string> {
        const defaultErrorMessage = `No conversion rate found for ${conversion.target}`;
        try {
            const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${conversion.base.toUpperCase()}`, {
                timeout: 5000,
            });
            const apiResult: ConversionApiResult = response.data;
            const targetKey = Object.keys(apiResult.rates).find((r) => r.toLowerCase() === conversion.target.toLowerCase());
            if (targetKey) {
                const rate = Number(apiResult.rates[targetKey]);
                const converted = Number.parseFloat(`${conversion.value * rate}`).toFixed(Number(precision));
                return Number(converted);
            } else {
                return defaultErrorMessage;
            }
        } catch (error) {
            return defaultErrorMessage;
        }
    }
}
