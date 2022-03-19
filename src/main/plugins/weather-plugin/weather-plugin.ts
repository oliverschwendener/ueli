import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { TranslationSet } from "../../../common/translation/translation-set";
import { WeatherOptions } from "../../../common/config/weather-options";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { defaultWeatherIcon } from "../../../common/icon/default-icons";
import { Weather } from "./weather";
import { GeneralOptions } from "../../../common/config/general-options";

export class WeatherPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.Weather;
    private config: WeatherOptions;
    private generalConfig: GeneralOptions;
    private translationSet: TranslationSet;
    private readonly clipboardCopier: (value: string) => Promise<void>;

    constructor(
        config: UserConfigOptions,
        translationSet: TranslationSet,
        clipboardCopier: (value: string) => Promise<void>,
    ) {
        this.config = config.weatherOptions;
        this.generalConfig = config.generalOptions;
        this.translationSet = translationSet;
        this.clipboardCopier = clipboardCopier;
    }

    public isValidUserInput(userInput: string): boolean {
        return userInput.startsWith(this.config.prefix);
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        const lang = this.getLanguage(this.generalConfig.language);
        return new Promise((resolve, reject) => {
            const region = userInput.replace(this.config.prefix, "").trim();
            Weather.getWeatherInfo(lang, region, this.config.temperatureUnit)
                .then((weatherInfo) => {
                    const result: SearchResultItem = {
                        description: this.translationSet.weatherCopyToClipboard,
                        executionArgument: region,
                        hideMainWindowAfterExecution: true,
                        icon: defaultWeatherIcon,
                        name: weatherInfo,
                        originPluginType: this.pluginType,
                        searchable: [],
                    };
                    resolve([result]);
                })
                .catch((error) => reject(error));
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem): Promise<void> {
        return this.clipboardCopier(searchResultItem.executionArgument);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        this.config = updatedConfig.weatherOptions;
        this.generalConfig = updatedConfig.generalOptions;
        this.translationSet = translationSet;
        return Promise.resolve();
    }

    private getLanguage(lang: string): string {
        if (lang === "English") return "en";
        if (lang === "Deutsch") return "de";
        if (lang === "Português") return "pt";
        if (lang === "Русский") return "ru";
        if (lang === "Česky") return "cs";
        if (lang === "Türkçe") return "tr";
        if (lang === "Español") return "es";
        if (lang === "简体中文") return "zh";
        if (lang === "한국어") return "ko";
        if (lang === "日本語") return "ja";
        return "en";
    }
}
