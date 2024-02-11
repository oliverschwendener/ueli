import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { SettingsManager } from "@Core/SettingsManager";
import type { ExcludedSearchResults as ExcludedSearchResultsInterface } from "./Contract";

export class ExcludedSearchResults implements ExcludedSearchResultsInterface {
    private static readonly settingKey = "searchEngine.excludedItems";

    private readonly items: string[] = [];

    public constructor(
        private readonly browserWindowNotifier: BrowserWindowNotifier,
        private readonly settingsManager: SettingsManager,
    ) {
        this.items = settingsManager.getValue<string[]>(ExcludedSearchResults.settingKey, []);
    }

    public async add(id: string): Promise<void> {
        if (this.exists(id)) {
            throw new Error(`Failed to add item. Reason: item with id "${id}" already exists`);
        }

        this.items.push(id);
        await this.saveChanges();
        this.emitItemsUpdatedEvent();
    }

    public async remove(id: string): Promise<void> {
        if (!this.exists(id)) {
            throw new Error(`Failed to remove item. Reason: item with id "${id}" not found`);
        }

        const indexToDelete = this.items.findIndex((i) => i === id);
        this.items.splice(indexToDelete, 1);
        await this.saveChanges();
        this.emitItemsUpdatedEvent();
    }

    public getExcludedIds(): string[] {
        return this.items;
    }

    private async saveChanges(): Promise<void> {
        await this.settingsManager.updateValue<string[]>(ExcludedSearchResults.settingKey, this.items);
    }

    private exists(id: string): boolean {
        return this.items.includes(id);
    }

    private emitItemsUpdatedEvent() {
        this.browserWindowNotifier.notify("excludedSearchResultItemsUpdated");
    }
}
