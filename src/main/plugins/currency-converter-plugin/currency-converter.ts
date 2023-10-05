import axios from "axios";
import { ConversionApiResult } from "./conversion-api-result";
import { CurrencyConversion } from "./currency-conversion";

const defaultTimeout = 5000;
const baseUrls = {
    jsdelivr: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies",
    github: "https://raw.githubusercontent.com/fawazahmed0/currency-api/1/latest/currencies",
};

export class CurrencyConverter {
    public static async convert(conversion: CurrencyConversion, precision: number): Promise<number> {
        const fetchWithFallback = async (urls: string[], target: string): Promise<number> => {
            let errorMsg = "";
            for (const url of urls) {
                try {
                    const response = await axios.get(url, { timeout: defaultTimeout });
                    if (!response.status.toString().startsWith("2")) {
                        errorMsg = `Response status: ${response.status} (${response.statusText})`;
                        continue;
                    }
                    const conversionResult: ConversionApiResult = response.data;
                    if (typeof conversionResult[target] !== "number" || !isFinite(conversionResult[target])) {
                        errorMsg = `Result: ${JSON.stringify(conversionResult)}`;
                        continue;
                    }
                    return conversionResult[target];
                } catch (err) {
                    errorMsg = err;
                    continue;
                }
            }
            throw `Unable to get exchange rate. ${errorMsg}`;
        };

        const conversionBase = conversion.base.toLowerCase();
        const conversionTarget = conversion.target.toLowerCase();
        const rate = await fetchWithFallback(
            [
                `${baseUrls.jsdelivr}/${conversionBase}/${conversionTarget}.min.json`,
                `${baseUrls.jsdelivr}/${conversionBase}/${conversionTarget}.json`,
                `${baseUrls.github}/${conversionBase}/${conversionTarget}.min.json`,
                `${baseUrls.github}/${conversionBase}/${conversionTarget}.json`,
            ],
            conversion.target.toLowerCase(),
        );

        return Number(Number.parseFloat(`${conversion.value * rate}`).toFixed(Number(precision)));
    }
}
