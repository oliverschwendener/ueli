import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { TranslationSet } from "../../../common/translation/translation-set";
import { WeatherOptions } from "../../../common/config/weather-options";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { defaultWeatherIcon } from "../../../common/icon/default-icons";
import { Weather } from "./weather";

export class WeatherPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.WeatherPlugin;
    constructor(
        private config: WeatherOptions,
        private translationSet: TranslationSet,
        private readonly clipboardCopier: (value: string) => Promise<void>,
    ) {}

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        return userInput.startsWith(this.config.prefix);
    }

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const region = userInput.replace(this.config.prefix, "").trim();
            Weather.getWeatherInfo(region, this.config.temperatureUnit).then((weatherInfo) => {
                const result: SearchResultItem = {
                    description: weatherInfo.feelsLike,
                    executionArgument: region,
                    hideMainWindowAfterExecution: true,
                    icon: defaultWeatherIcon,
                    name: weatherInfo.actualWeather,
                    originPluginType: this.pluginType,
                    searchable: [],
                };
                resolve([result]);
            });
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.clipboardCopier(searchResultItem.executionArgument);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.weatherOptions;
            this.translationSet = translationSet;
            resolve();
        });
    }
}
