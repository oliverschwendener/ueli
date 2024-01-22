import type { EventEmitter } from "@Core/EventEmitter";
import type { SettingsManager } from "@Core/SettingsManager";
import type { ExcludedSearchResultItem } from "@common/Core";
import type { ExcludedSearchResults as ExcludedSearchResultsInterface } from "./Contract";

export class ExcludedSearchResults implements ExcludedSearchResultsInterface {
    private static readonly settingKey = "searchEngine.excludedItems";

    private items: Record<string, ExcludedSearchResultItem> = {};

    public constructor(
        private readonly eventEmitter: EventEmitter,
        private readonly settingsManager: SettingsManager,
    ) {
        const items = settingsManager.getValue<ExcludedSearchResultItem[]>(ExcludedSearchResults.settingKey, []);

        for (const item of items) {
            this.items[item.id] = item;
        }
    }

    public async addItem(item: ExcludedSearchResultItem): Promise<void> {
        this.items[item.id] = item;
        await this.saveChanges();
        this.emitItemsUpdatedEvent();
    }

    public async removeItem(itemId: string): Promise<void> {
        delete this.items[itemId];
        await this.saveChanges();
        this.emitItemsUpdatedEvent();
    }

    public getExcludedItems(): ExcludedSearchResultItem[] {
        return Object.keys(this.items).map(
            (id): ExcludedSearchResultItem => ({
                id,
                name: this.items[id].name,
                imageUrl: this.items[id].imageUrl,
            }),
        );
    }

    private async saveChanges(): Promise<void> {
        await this.settingsManager.updateValue<ExcludedSearchResultItem[]>(
            ExcludedSearchResults.settingKey,
            this.getExcludedItems(),
        );
    }

    private emitItemsUpdatedEvent() {
        this.eventEmitter.emitEvent("excludedSearchResultItemsUpdated");
    }
}
