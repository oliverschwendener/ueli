import { ExecutionPlugin } from "../main/execution-plugin";
import { SearchResultItem } from "../common/search-result-item";
import { PluginType } from "../main/plugin-type";
import { UserConfigOptions } from "../common/config/user-config-options";
import { TranslationSet } from "../common/translation/translation-set";

export class FakeExecutionPlugin implements ExecutionPlugin {
    public pluginType = PluginType.Test;

    private readonly validUserInput: boolean;
    private readonly enabled: boolean;
    private readonly searchResults: SearchResultItem[];

    constructor(isEnabled: boolean, isValidUserInput: boolean, searchResults: SearchResultItem[]) {
        this.enabled = isEnabled;
        this.validUserInput = isValidUserInput;
        this.searchResults = searchResults;
    }

    public isValidUserInput(userInput: string, fallback?: boolean): boolean {
        return this.validUserInput;
    }

    public getSearchResults(userInput: string, fallback?: boolean): Promise<SearchResultItem[]> {
        return Promise.resolve(this.searchResults);
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
