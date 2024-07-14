import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Net } from "electron";



interface InvokeResponse {
    word: string;
    phonetic: string;
    meanings: {
        partOfSpeech: string;
        definitions: {
            definition: string;
            example?: string;
        }[];
        synonyms?: string[];
        antonyms?: string[];
    }[],
}
export class EnglishDictionary implements Extension {
    private static readonly translationNamespace = "extension[EnglishDictionary]";

    public readonly id = "EnglishDictionary";
    public readonly name = "English Dictionary";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: EnglishDictionary.translationNamespace,
    };

    public readonly author = {
        name: "Marcos Vitor",
        githubUserName: "marvitphy",
    };

    private readonly defaultSettings = {
        currencies: ["usd", "chf", "eur"],
    };

    private readonly rates: Record<string, Record<string, number>>;
   


    public constructor(
        private readonly settingsManager: SettingsManager,
        private readonly net: Net,
        private readonly assetPathResolver: AssetPathResolver,
    
    ) {
        this.rates = {};
    }



    public async invoke(argument: {
        word: string;
    }): Promise<InvokeResponse | ''> {
        const apiResponse = await this.fetchDefinition({ word: argument.word });
        return apiResponse
    }

    public async getSearchResultItems(): Promise<SearchResultItem[]> {

        return [
            {
                id: "EnglishDictionary:invoke",
                description: 'Open English Dictionary',
                name: 'English Dictionary',
                image: this.getImage(),
                defaultAction: SearchResultItemActionUtility.createInvokeExtensionAction({
                    extensionId: this.id,
                    description: 'Open English Dictionary',
                    fluentIcon: "OpenRegular",
                }),
            },
        ];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.defaultSettings[key];
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "english-dictionary-logo.png")}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "English Dictionary",
                searchResult: "Search Result",
                description: "Search for definitions",
                copyToClipboard: "Copy to clipboard",
            }
        };
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [getExtensionSettingKey(this.id, "currencies")];
    }

    private async fetchDefinition({ word }: {
        word: string
    }): Promise<InvokeResponse | ''> {
        try {
            const response = await this.net.fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();

            if (!data || data.title === "No Definitions Found") {
                return ''
            }
            return data[0]


        } catch (error) {
            console.error("Failed to fetch definition:", error);
            return ''
        }
    }

    private async setRates(): Promise<void> {
        const currencies = this.settingsManager.getValue(
            getExtensionSettingKey(this.id, "currencies"),
            this.defaultSettings.currencies,
        );

        await Promise.allSettled(currencies.map((currency) => this.setRate(currency)));
    }

    private async setRate(currency: string): Promise<void> {
        const response = await this.net.fetch(
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`,
        );

        const responseJson = await response.json();

        this.rates[currency] = responseJson[currency];
    }
}
