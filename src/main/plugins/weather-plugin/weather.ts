import axios, { AxiosResponse } from "axios";
import { CurrentCondition, WeatherAPI } from "./weather-api";

export class Weather {
    public static getWeatherInfo(lang: string, region: string, tempUnit: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const url = `https://wttr.in/${region}?lang=${lang}&format=j1`;
            axios
                .get(url, { timeout: 5000 })
                .then((response: AxiosResponse) => {
                    if (!response.status.toString().startsWith("2")) {
                        reject(
                            `Unable to get weather information. Response status: ${response.status} (${response.statusText})`,
                        );
                        return;
                    }
                    const weatherResult: WeatherAPI = response.data;
                    const currentWeather = weatherResult.current_condition[0];
                    if (currentWeather.temp_C === null || currentWeather.weatherDesc[0].value === null) {
                        reject(`Unable to get weather information. Result: ${weatherResult}`);
                        return;
                    }

                    const weatherDescription = this.getWeatherDescription(lang, currentWeather);
                    const result =
                        tempUnit === "Celsius"
                            ? `${currentWeather.temp_C}°C - ${weatherDescription}`
                            : `${currentWeather.temp_F}°F - ${weatherDescription}`;
                    resolve(result);
                })
                .catch((err) => reject(err));
        });
    }

    public static getWeatherDescription(lang: string, currWeather: CurrentCondition): string {
        switch (lang) {
            case "de":
                return currWeather.lang_de[0].value;
            case "pt":
                return currWeather.lang_pt[0].value;
            case "ru":
                return currWeather.lang_ru[0].value;
            case "cs":
                return currWeather.lang_cs[0].value;
            case "tr":
                return currWeather.lang_tr[0].value;
            case "es":
                return currWeather.lang_es[0].value;
            case "zh":
                return currWeather.lang_zh[0].value;
            case "ko":
                return currWeather.lang_ko[0].value;
            case "ja":
                return currWeather.lang_ja[0].value;
            default:
                return currWeather.weatherDesc[0].value;
        }
    }
}
