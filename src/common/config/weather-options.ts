import { TemperatureUnit } from "../../main/plugins/weather-plugin/weather-temperature-unit";

export interface WeatherOptions {
    isEnabled: boolean;
    prefix: string;
    temperatureUnit: TemperatureUnit;
}

export const defaultWeatherOptions: WeatherOptions = {
    isEnabled: false,
    prefix: "wea?",
    temperatureUnit: TemperatureUnit.Celsius,
};
