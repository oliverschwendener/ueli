import axios, { AxiosResponse } from "axios";
import { WeatherAPI } from "./weather-api";

interface WeatherInfo {
    actualWeather: string;
    feelsLike: string;
}

export class Weather {
    public static getWeatherInfo(region: string, tempUnit: string): Promise<WeatherInfo> {
        return new Promise((resolve, reject) => {
            const url = `https://wttr.in/${region}?format=j1`;
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
                    if (
                        weatherResult.current_condition[0].temp_C == null ||
                        weatherResult.current_condition[0].weatherDesc[0].value == null
                    ) {
                        reject(`Unable to get weather information. Result: ${weatherResult}`);
                        return;
                    }

                    const result =
                        tempUnit == "Celsius"
                            ? {
                                  actualWeather: `${weatherResult.current_condition[0].temp_C}°C - ${weatherResult.current_condition[0].weatherDesc[0].value}`,
                                  feelsLike: `${weatherResult.current_condition[0].FeelsLikeC}°C`,
                              }
                            : {
                                  actualWeather: `${weatherResult.current_condition[0].temp_F}°F - ${weatherResult.current_condition[0].weatherDesc[0].value}`,
                                  feelsLike: `${weatherResult.current_condition[0].FeelsLikeF}°F`,
                              };
                    resolve(result);
                })
                .catch((err) => reject(err));
        });
    }
}
