import { ExecutionPlugin } from "../../execution-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { PluginType } from "../../plugin-type";
import { clipboard } from "electron";
import { StringHelpers } from "../../../common/helpers/string-helpers";
import { defaultErrorIcon, defaultTranslatorIcon } from "../../../common/icon/default-icons";
import { LingueeTranslator } from "./linguee-translator";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { TranslationOptions } from "../../../common/config/translation-options";

export class TranslationPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.TranslationPlugin;
    public readonly openLocationSupported = false;
    public readonly autoCompletionSupported = false;
    private config: TranslationOptions;
    private delay: NodeJS.Timeout | number;

    constructor(config: TranslationOptions) {
        this.config = config;
    }

    public async execute(searchResultItem: SearchResultItem): Promise<void> {
        clipboard.writeText(searchResultItem.executionArgument);
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw new Error("Opening location is not supported on this plugin");
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw new Error("Autocompletion not supported");
    }

    public async getSearchResults(userInput: string): Promise<SearchResultItem[]> {
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

    public async updateConfig(updatedConfig: UserConfigOptions): Promise<void> {
        this.config = updatedConfig.translationOptions;
    }

    private async getTranslationResults(url: string): Promise<SearchResultItem[]> {
        try {
            const translations = await LingueeTranslator.getTranslations(url);
            const result = translations.map((t): SearchResultItem => {
                return {
                    description: `${StringHelpers.capitalize(t.word_type.pos)}`,
                    executionArgument: t.text,
                    hideMainWindowAfterExecution: true,
                    icon: defaultTranslatorIcon,
                    name: t.text,
                    originPluginType: this.pluginType,
                    searchable: [],
                };
            });
            if (result.length > 0) {
                return result;
            } else {
                return [this.getErrorResult("No translations found")];
            }
        } catch (error) {
            return [this.getErrorResult(error.response.data.message, error.message)];
        }
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
