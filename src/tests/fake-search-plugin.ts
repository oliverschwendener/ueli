import { SearchPlugin } from "../main/search-plugin";
import { PluginType } from "../main/plugin-type";
import { SearchResultItem } from "../common/search-result-item";

export class FakeSearchPlugin implements SearchPlugin {
    public pluginType: PluginType;
    private readonly items: SearchResultItem[];
    private readonly enabled: boolean;
    private indexRefreshCount: number;

    constructor(pluginType: PluginType, items: SearchResultItem[], enabled: boolean) {
        this.pluginType = pluginType;
        this.items = items;
        this.enabled = enabled;
        this.indexRefreshCount = 0;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            resolve(this.items);
        });
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve) => {
            this.indexRefreshCount++;
            resolve();
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve, reject) => {
            reject("Method not implemented.");
        });
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public execute(): Promise<void> {
        return new Promise((_, reject) => {
            reject("Method not implemented.");
        });
    }

    public updateConfig(): Promise<void> {
        return new Promise((_, reject) => {
            reject("Method not implemented.");
        });
    }

    public getIndexRefreshCount() {
        return this.indexRefreshCount;
    }
}
