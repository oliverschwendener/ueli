import { ExecutionPlugin } from "../../execution-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { PluginType } from "../../plugin-type";
import { clipboard } from "electron";
import { StringHelpers } from "../../../common/helpers/string-helpers";
import { defaultErrorIcon } from "../../../common/icon/default-icons";
import { Icon } from "../../../common/icon/icon";
import { IconType } from "../../../common/icon/icon-type";
import { LingueeTranslator } from "./linguee-translator";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { TranslationOptions } from "../../../common/config/translation-options";

export class TranslationExecutionPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.TranslationPlugin;
    public readonly openLocationSupported = false;
    public readonly autoCompletionSupported = false;
    private config: TranslationOptions;
    private delay: NodeJS.Timeout | number;
    private readonly icon: Icon = {
        parameter: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
        <g id="surface1">
        <path style=" " d="M 4 4 L 4 22 L 10 22 L 10 28 L 28 28 L 28 10 L 22 10 L 22 4 Z M 6 6 L 20 6 L 20 10.5625 L 10.5625 20 L 6 20 Z M 11 8 L 11 9 L 8 9 L 8 11 L 12.9375 11 C 12.808594 12.148438 12.457031 13.054688 11.875 13.6875 C 11.53125 13.574219 11.222656 13.433594 10.96875 13.28125 C 10.265625 12.863281 10 12.417969 10 12 L 8 12 C 8 13.191406 8.734375 14.183594 9.71875 14.84375 C 9.226563 14.949219 8.65625 15 8 15 L 8 17 C 9.773438 17 11.25 16.59375 12.375 15.84375 C 12.898438 15.933594 13.429688 16 14 16 L 14 14.125 C 14.542969 13.214844 14.832031 12.152344 14.9375 11 L 16 11 L 16 9 L 13 9 L 13 8 Z M 21.4375 12 L 26 12 L 26 26 L 12 26 L 12 21.4375 Z M 20 13.84375 L 19.0625 16.6875 L 17.0625 22.6875 L 17 22.84375 L 17 24 L 19 24 L 19 23.125 L 19.03125 23 L 20.96875 23 L 21 23.125 L 21 24 L 23 24 L 23 22.84375 L 22.9375 22.6875 L 20.9375 16.6875 Z M 20 20.125 L 20.28125 21 L 19.71875 21 Z "></path>
        </g>
        </svg>`,
        type: IconType.SVG,
    };

    constructor(config: TranslationOptions) {
        this.config = config;
    }

    public execute(searchResultItem: SearchResultItem): Promise<void> {
        return new Promise((resolve) => {
            clipboard.writeText(searchResultItem.executionArgument);
            resolve();
        });
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw new Error("Opening location is not supported on this plugin");
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        return new Promise((resolve, reject) => {
            reject("Autocompletion not supported");
        });
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const textToTranslate = userInput.replace(this.config.prefix, "");
            const source = this.config.sourceLanguage;
            const target = this.config.targetLanguage;
            const url = `https://linguee-api.herokuapp.com/api?q=${textToTranslate}&src=${source}&dst=${target}`;

            if (this.delay !== undefined) {
                clearTimeout(this.delay as number);
            }

            this.delay = setTimeout(() => {
                this.getTranslationResults(url)
                    .then((result) => resolve(result))
                    .catch((err) => reject(err));
            }, this.config.debounceDelay);
        });
    }

    public isEnabled() {
        return this.config.enabled;
    }

    public isValidUserInput(userInput: string) {
        return userInput.startsWith(this.config.prefix)
            && userInput.replace(this.config.prefix, "").length >= this.config.minSearchTermLength;
    }

    public updateConfig(updatedConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.translationOptions;
            resolve();
        });
    }

    private getTranslationResults(url: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            LingueeTranslator.getTranslations(url)
                .then((translations) => {
                    const result = translations.map((t): SearchResultItem => {
                        return {
                            description: `${StringHelpers.capitalize(t.word_type.pos)}`,
                            executionArgument: t.text,
                            hideMainWindowAfterExecution: true,
                            icon: this.icon,
                            name: t.text,
                            originPluginType: this.pluginType,
                            searchable: [],
                        };
                    });
                    if (result.length > 0) {
                        resolve(result);
                    } else {
                        resolve([this.getErrorResult("No translations found")]);
                    }
                })
                .catch((err) => resolve([this.getErrorResult(err.response.data.message, err.message)]));
            });
    }

    private getErrorResult(errorMessage: string, details?: string): SearchResultItem {
        return {
            description: details ? details : "",
            executionArgument: "",
            hideMainWindowAfterExecution: false,
            icon: defaultErrorIcon,
            name: errorMessage,
            originPluginType: PluginType.None,
            searchable: [],
        };
    }
}
