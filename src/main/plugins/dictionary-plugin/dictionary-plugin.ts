import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { DictionaryOptions } from "../../../common/config/dictionary-options";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { Definition } from "./dictionary";
import { defaultDictionaryIcon } from "../../../common/icon/default-icons";
import { capitalize } from "../../../common/helpers/string-helpers";

interface DictionaryResult {
    definition: string;
    type: string;
    synonyms: string[];
}

export class DictionaryPlugin implements ExecutionPlugin {
    public pluginType = PluginType.Dictionary;
    private config: DictionaryOptions;
    private readonly clipboardCopier: (value: string) => Promise<void>;
    private readonly definitionRetriever: (word: string) => Promise<Definition[]>;
    private delay: NodeJS.Timeout | number | undefined;

    constructor(
        config: DictionaryOptions,
        clipboardCopier: (value: string) => Promise<void>,
        definitionRetriever: (word: string) => Promise<Definition[]>,
    ) {
        this.config = config;
        this.clipboardCopier = clipboardCopier;
        this.definitionRetriever = definitionRetriever;
    }

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        const searchTerm = this.getSearchTerm(userInput);
        return userInput.startsWith(this.config.prefix) && searchTerm.length >= this.config.minSearchTermLength;
    }

    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        const searchTerm = this.getSearchTerm(userInput);
        return new Promise((resolve, reject) => {
            if (this.delay) {
                clearTimeout(this.delay as number);
            }

            this.delay = setTimeout(() => {
                this.definitionRetriever(searchTerm)
                    .then((definitions) => resolve(this.buildSearchResults(definitions)))
                    .catch((err) => reject(err));
            }, this.config.debounceDelay);
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.clipboardCopier(searchResultItem.executionArgument);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve, reject) => {
            this.config = updatedConfig.dictionaryOptions;
            resolve();
        });
    }

    private getSearchTerm(userInput: string): string {
        return userInput.replace(this.config.prefix, "");
    }

    private buildSearchResults(definitions: Definition[]): SearchResultItem[] {
        const dictionaryResults: DictionaryResult[] = [];

        definitions.forEach((definition) => {
            const keys = Object.keys(definition.meaning);
            keys.forEach((key) => {
                definition.meaning[key]
                    .filter((entry: any) => {
                        return entry.definition;
                    })
                    .forEach((entry: any) => {
                        dictionaryResults.push({
                            definition: entry.definition,
                            synonyms: entry.synonyms ? entry.synonyms : [],
                            type: capitalize(key),
                        });
                    });
            });
        });

        return dictionaryResults.map(
            (result): SearchResultItem => {
                return {
                    description: result.definition,
                    executionArgument: result.definition,
                    hideMainWindowAfterExecution: true,
                    icon: defaultDictionaryIcon,
                    name: this.buildName(result),
                    originPluginType: this.pluginType,
                    searchable: [],
                };
            },
        );
    }

    private buildName(result: DictionaryResult): string {
        const suffix = result.synonyms.length > 0 ? ` - ${result.synonyms.join(", ")}` : "";

        return `[${result.type}]${suffix}`;
    }
}
