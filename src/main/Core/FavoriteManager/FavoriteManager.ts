import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { SettingsManager } from "@Core/SettingsManager";

export class FavoriteManager {
    private readonly settingKey = "favorites";

    public readonly favorites: string[];

    public constructor(
        private readonly settingsManager: SettingsManager,
        private readonly browserWindowNotifier: BrowserWindowNotifier,
    ) {
        this.favorites = settingsManager.getValue<string[]>(this.settingKey, []);
    }

    public async add(id: string): Promise<void> {
        if (this.exists(id)) {
            throw new Error(`Favorite with id ${id} is already added`);
        }

        this.favorites.push(id);
        await this.saveChanges();
        this.browserWindowNotifier.notifyAll({ channel: "favoritesUpdated" });
    }

    public async remove(id: string): Promise<void> {
        const indexToDelete = this.favorites.findIndex((f) => f === id);
        this.favorites.splice(indexToDelete, 1);
        await this.saveChanges();
        this.browserWindowNotifier.notifyAll({ channel: "favoritesUpdated" });
    }

    public getAll(): string[] {
        return this.favorites;
    }

    private async saveChanges(): Promise<void> {
        await this.settingsManager.updateValue(this.settingKey, this.favorites);
    }

    private exists(id: string): boolean {
        return this.favorites.includes(id);
    }
}
