import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { WebSearchEngine } from "./WebSearchEngine";

export class WebSearchExtension implements Extension {
    public readonly id = "WebSearch";
    public readonly name = "Web Search";
    public readonly nameTranslationKey = "extension[WebSearch].extensionName";

    private readonly defaultSettings = {
        searchEngine: "Google",
        locale: "en-US",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly webSearchEngines: WebSearchEngine[],
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const webSearchEngine = this.getCurrentWebSearchEngine();

        return [
            {
                id: "webSearch:invoke",
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

        const webSearchEngine = this.getCurrentWebSearchEngine();

        const suggestions = await webSearchEngine.getSuggestions(searchTerm, locale);

        return [
            {
                defaultAction: SearchResultItemActionUtility.createOpenUrlSearchResultAction({
                    url: webSearchEngine.getSearchUrl(searchTerm, locale),
                }),
                description: webSearchEngine.getName(),
                id: `search-${webSearchEngine.getName()}`,
                name: `Search "${searchTerm}"`,
                imageUrl: this.getSearchResultImageUrl(webSearchEngine),
            },
            ...suggestions.map((s, i) => ({
                defaultAction: SearchResultItemActionUtility.createOpenUrlSearchResultAction({ url: s.url }),
                description: "Suggestion",
                id: `suggestion-${i}`,
                name: s.text,
                imageUrl: this.getSearchResultImageUrl(webSearchEngine),
            })),
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

    public getImageUrl(): string {
        return this.getSearchResultImageUrl(this.getCurrentWebSearchEngine());
    }

    private getCurrentWebSearchEngine(): WebSearchEngine {
        const searchEngine = this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "searchEngine"),
            this.getSettingDefaultValue("searchEngine"),
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
