import { SearchPlugin } from "../main/search-plugin";
import { PluginType } from "../main/plugin-type";
import { SearchResultItem } from "../common/search-result-item";
import { UserConfigOptions } from "../common/config/user-config-options";
import { TranslationSet } from "../common/translation/translation-set";
import { AutoCompletionResult } from "../common/auto-completion-result";

export class FakeSearchPlugin implements SearchPlugin {
    public pluginType: PluginType;
    public openLocationSupported: boolean;
    public autoCompletionSupported: boolean;
    private readonly items: SearchResultItem[];
    private readonly enabled: boolean;

    constructor(pluginType: PluginType, items: SearchResultItem[], enabled: boolean) {
        this.pluginType = pluginType;
        this.items = items;
        this.enabled = enabled;
    }

    public async getAll(): Promise<SearchResultItem[]> {
        return this.items;
    }
    public async refreshIndex(): Promise<void> {
        throw Error("Method not implemented.");

    }
    public clearCache(): Promise<void> {
        throw Error("Method not implemented.");
    }
    public isEnabled(): boolean {
        return this.enabled;
    }
    public async execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        throw Error("Method not implemented.");
    }
    public async openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw Error("Method not implemented.");
    }
    public async autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw Error("Method not implemented.");
    }
    public async updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        throw Error("Method not implemented.");
    }
}
