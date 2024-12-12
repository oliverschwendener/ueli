import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import {
    createEmptyInstantSearchResult,
    createInvokeExtensionAction,
    createOpenUrlSearchResultAction,
    type InstantSearchResultItems,
    type SearchResultItem,
} from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Settings } from "./Settings";
import type { WebSearchEngine } from "./WebSearchEngine";

export class WebSearchExtension implements Extension {
    public readonly id = "WebSearch";
    public readonly name = "Web Search";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[WebSearch]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    private readonly defaultSettings: Settings = {
        searchEngine: "Google",
        locale: "en-US",
        showInstantSearchResult: false,
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly webSearchEngines: WebSearchEngine[],
    ) {}

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        const showInstantSearchResult = this.settingsManager.getValue(
            getExtensionSettingKey(this.id, "showInstantSearchResult"),
            this.getSettingDefaultValue("showInstantSearchResult"),
        );

        if (searchTerm.trim().length && showInstantSearchResult) {
            const locale = this.settingsManager.getValue<string>(
                getExtensionSettingKey(this.id, "locale"),
                <string>this.getSettingDefaultValue("locale"),
            );

            const webSearchEngine = this.getCurrentWebSearchEngine();

            return {
                after: [this.getInstantSearchResultItem(searchTerm, locale, webSearchEngine)],
                before: [],
            };
        }

        return createEmptyInstantSearchResult();
    }

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const webSearchEngine = this.getCurrentWebSearchEngine();

        return [
            {
                id: "webSearch:invoke",
                defaultAction: createInvokeExtensionAction({
                    description: `Search ${webSearchEngine.getName()}`,
                    extensionId: this.id,
                }),
                description: "Web Search",
                name: webSearchEngine.getName(),
                image: { url: this.getSearchResultImageUrl(webSearchEngine) },
            },
        ];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue(key: keyof Settings) {
        return this.defaultSettings[key];
    }

    public async invoke({ searchTerm }: { searchTerm: string }): Promise<SearchResultItem[]> {
        const locale = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "locale"),
            <string>this.getSettingDefaultValue("locale"),
        );

        const webSearchEngine = this.getCurrentWebSearchEngine();

        const suggestions = await webSearchEngine.getSuggestions(searchTerm, locale);

        return [
            this.getInstantSearchResultItem(searchTerm, locale, webSearchEngine),
            ...suggestions.map(
                (s, i) =>
                    <SearchResultItem>{
                        defaultAction: createOpenUrlSearchResultAction({ url: s.url }),
                        description: "Suggestion",
                        id: `suggestion-${i}`,
                        name: s.text,
                        image: { url: this.getSearchResultImageUrl(webSearchEngine) },
                    },
            ),
        ];
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return ["general.language", getExtensionSettingKey(this.id, "searchEngine")];
    }

    public getAssetFilePath(key: string): string {
        return this.assetPathResolver.getExtensionAssetPath(
            this.id,
            this.getWebSearchEngineByName(key).getImageFileName(),
        );
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "websearch.png")}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Web Search",
                searchEngine: "Search Engine",
                locale: "Locale",
                showInstantSearchResult: "Show instant search result",
            },
            "de-CH": {
                extensionName: "Websuche",
                searchEngine: "Suchmaschine",
                locale: "Sprachregion",
                showInstantSearchResult: "Sofortiges Suchergebnis anzeigen",
            },
        };
    }

    private getInstantSearchResultItem(
        searchTerm: string,
        locale: string,
        webSearchEngine: WebSearchEngine,
    ): SearchResultItem {
        return {
            defaultAction: createOpenUrlSearchResultAction({
                url: webSearchEngine.getSearchUrl(searchTerm, locale),
            }),
            description: webSearchEngine.getName(),
            id: `search-${webSearchEngine.getName()}`,
            name: `Search "${searchTerm}"`,
            image: { url: this.getSearchResultImageUrl(webSearchEngine) },
        };
    }

    private getCurrentWebSearchEngine(): WebSearchEngine {
        const searchEngine = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "searchEngine"),
            <string>this.getSettingDefaultValue("searchEngine"),
        );

        return this.getWebSearchEngineByName(searchEngine);
    }

    private getWebSearchEngineByName(name: string): WebSearchEngine {
        const webSearchEngine = this.webSearchEngines.find((w) => w.getName() === name);

        if (!webSearchEngine) {
            throw new Error(`Unable to find web search engine with name '${name}'`);
        }

        return webSearchEngine;
    }

    private getSearchResultImageUrl(webSearchEngine: WebSearchEngine): string {
        return `file://${this.assetPathResolver.getExtensionAssetPath(this.id, webSearchEngine.getImageFileName())}`;
    }
}
