import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { WebSearchEngine } from "./WebSearchEngine";

export class WebSearchExtension implements Extension {
    public readonly id = "WebSearch";
    public readonly name = "Web Search";
    // TODO: public readonly nameTranslationKey = "";

    private readonly defaultSettings = {
        searchEngine: "DuckDuckGo",
        locale: "en-US",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly webSearchEngines: WebSearchEngine[],
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const webSearchEngine = this.getWebSearchEngine();

        return [
            {
                id: "webSearch:DuckDuckGo",
                defaultAction: SearchResultItemActionUtility.createInvokeExtensionAction({
                    description: `Search ${webSearchEngine.getName()}`,
                    extensionId: this.id,
                }),
                description: "Web Search",
                name: webSearchEngine.getName(),
                imageUrl: this.getSearchResultImageUrl(webSearchEngine),
            },
        ];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.defaultSettings[key];
    }

    public async invoke({ searchTerm }: { searchTerm: string }): Promise<SearchResultItem[]> {
        const locale = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "locale"),
            this.getSettingDefaultValue("locale"),
        );

        const webSearchEngine = this.getWebSearchEngine();

        const suggestions = await webSearchEngine.getSuggestions(searchTerm, locale);

        const searchResultItem = <SearchResultItem>{
            defaultAction: SearchResultItemActionUtility.createOpenUrlSearchResultAction({
                url: webSearchEngine.getSearchUrl(searchTerm, locale),
            }),
            description: webSearchEngine.getName(),
            id: `search-${webSearchEngine.getName()}`,
            name: `Search "${searchTerm}"`,
            imageUrl: this.getSearchResultImageUrl(webSearchEngine),
        };

        return [
            searchResultItem,
            ...suggestions.map((s, i) => ({
                defaultAction: SearchResultItemActionUtility.createOpenUrlSearchResultAction({ url: s.url }),
                description: "Suggestion",
                id: `suggestion-${s}-${i}`,
                name: s.text,
                imageUrl: this.getSearchResultImageUrl(webSearchEngine),
            })),
        ];
    }

    public getSettingKeysTriggeringReindex(): string[] {
        return [getExtensionSettingKey(this.id, "searchEngine")];
    }

    public getAssetFilePath(key: string): string {
        const map = {
            Google: "google.png",
            DuckDuckGo: "duckduckgo.svg",
        };

        return this.assetPathResolver.getExtensionAssetPath(this.id, map[key]);
    }

    private getWebSearchEngine(): WebSearchEngine {
        const searchEngine = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "searchEngine"),
            this.getSettingDefaultValue("searchEngine"),
        );

        const webSearchEngine = this.webSearchEngines.find((w) => w.getName() === searchEngine);

        if (!webSearchEngine) {
            throw new Error(`Unable to find web search engine with name '${searchEngine}'`);
        }

        return webSearchEngine;
    }

    private getSearchResultImageUrl(webSearchEngine: WebSearchEngine): string {
        return `file://${this.assetPathResolver.getExtensionAssetPath(this.id, webSearchEngine.getImageFileName())}`;
    }
}
