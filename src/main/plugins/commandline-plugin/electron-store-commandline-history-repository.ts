import * as Store from "electron-store";
import { SearchResultItem } from "../../../common/search-result-item";
import { CommandlineHistoryRepository } from "./commandline-history-repository";

export class ElectronStoreCommandlineHistoryRepository implements CommandlineHistoryRepository {
    private readonly store: Store;
    private readonly historyStoreKey = "commandline-history";
    private history: SearchResultItem[];

    constructor() {
        this.store = new Store();
        this.history = this.store.get(this.historyStoreKey) || [];
    }
    refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.history = this.store.get(this.historyStoreKey) || [];
            resolve();
        })
    }
    getAll(): SearchResultItem[] {
        return this.history.length !== 0 ? this.history : [];
    }
    add(historyItem: SearchResultItem): void {
        if (this.history.length !== 0) {
            this.history = this.history.filter((element) => element.executionArgument !== historyItem.executionArgument);
            this.history.unshift(historyItem);
        } else {
            this.history = [historyItem];
        }
        this.store.set(this.historyStoreKey, this.history);
    }
    clearAll(): Promise<void> {
        return new Promise((resolve) => {
            this.history = [];
            this.store.set(this.historyStoreKey, this.history);
            resolve();
        })
    }


}