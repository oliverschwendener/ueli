import { ExecutionPlugin } from "../main/execution-plugin";
import { SearchResultItem } from "../common/search-result-item";
import { PluginType } from "../main/plugin-type";

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

    public isValidUserInput(): boolean {
        return this.validUserInput;
    }

    public getSearchResults(): Promise<SearchResultItem[]> {
        return Promise.resolve(this.searchResults);
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public execute(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public updateConfig(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
