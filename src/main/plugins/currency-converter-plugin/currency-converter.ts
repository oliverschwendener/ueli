import axios from "axios";
import { CurrencyConversion } from "./currency-conversion";
import { ConversionApiResult } from "./conversion-api-result";

export class CurrencyConverter {
    public static convert(conversion: CurrencyConversion, precision: number): Promise<number> {
        return new Promise((resolve, reject) => {
            axios.get(`https://api.exchangeratesapi.io/latest?base=${conversion.base.toUpperCase()}`, {
                timeout: 5000,
            })
                .then((response) => {
                    const apiResult: ConversionApiResult = response.data;
                    const targetKey = Object.keys(apiResult.rates).find((r) => r.toLowerCase() === conversion.target.toLowerCase());
                    if (targetKey) {
                        const rate = Number(apiResult.rates[targetKey]);
                        const converted = Number.parseFloat(`${conversion.value * rate}`).toFixed(Number(precision));
                        resolve(Number(converted));
                    } else {
                        reject(`No conversion rate found for ${conversion.target}`);
                    }
                })
                .catch((err) => reject(err));
        });
    }
}
