import type { EventEmitter } from "@Core/EventEmitter";
import type { SettingsManager } from "@Core/SettingsManager";
import type { SearchResultItem } from "@common/Core";
import type { FavoriteManager as FavoriteManagerInterface } from "./Contract";

export class FavoriteManager implements FavoriteManagerInterface {
    private readonly settingKey = "favorites";

    public readonly favorites: Record<string, SearchResultItem>;

    public constructor(
        private readonly settingsManager: SettingsManager,
        private readonly eventEmitter: EventEmitter,
    ) {
        this.favorites = settingsManager.getValue<Record<string, SearchResultItem>>(this.settingKey, {});
    }

    public async add(favorite: SearchResultItem): Promise<void> {
        this.favorites[favorite.id] = favorite;
        await this.saveChanges();
        this.eventEmitter.emitEvent("favoritesUpdated");
    }

    public async remove(id: string): Promise<void> {
        delete this.favorites[id];
        await this.saveChanges();
        this.eventEmitter.emitEvent("favoritesUpdated");
    }

    public getAll(): SearchResultItem[] {
        return Object.values(this.favorites);
    }

    private async saveChanges(): Promise<void> {
        await this.settingsManager.updateValue(this.settingKey, this.favorites);
    }
}
