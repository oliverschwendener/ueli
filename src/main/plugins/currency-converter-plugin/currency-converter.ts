import axios, { AxiosResponse } from "axios";
import { ConversionApiResult } from "./conversion-api-result";
import { CurrencyConversion } from "./currency-conversion";

export class CurrencyConverter {
    public static convert(conversion: CurrencyConversion, precision: number): Promise<number> {
        return new Promise((resolve, reject) => {
            const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${conversion.base.toLowerCase()}/${conversion.target.toLowerCase()}.min.json`;
            axios
                .get(url, { timeout: 5000 })
                .then((response: AxiosResponse) => {
                    if (!response.status.toString().startsWith("2")) {
                        reject(
                            `Unable to get exchange rate. Response status: ${response.status} (${response.statusText})`,
                        );
                        return;
                    }
                    const conversionResult: ConversionApiResult = response.data;
                    if (!conversionResult[conversion.target.toLowerCase()]) {
                        reject(`Unable to get exchange rate. Result: ${conversionResult}`);
                        return;
                    }
                    const rate = conversionResult[conversion.target.toLowerCase()];
                    const converted = Number.parseFloat(`${conversion.value * rate}`).toFixed(Number(precision));
                    resolve(Number(converted));
                })
                .catch((err) => reject(err));
        });
    }
}
