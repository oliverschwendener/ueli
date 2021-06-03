import { FavoriteRepository } from "./favorite-repository";
import { Favorite } from "./favorite";
import { SearchResultItem } from "../../common/search-result-item";
import Store = require("electron-store");

export class ElectronStoreFavoriteRepository implements FavoriteRepository {
    private readonly store: Store;
    private readonly favoritesStoreKey = "favorites";
    private favorites: Favorite[];

    constructor() {
        this.store = new Store({ name: "favorites" });

        this.favorites = this.migrateUserConfigFavorites() || this.store.get(this.favoritesStoreKey) || [];
    }

    private migrateUserConfigFavorites(): Favorite[] | undefined {
        // Favorites were moved from the user config store to their own store.
        // If favorites found in the user config store, migrate them.
        const userConfigStore = new Store();
        const userConfigFavoritesStoreKey = "favorites";
        const userConfigFavorites = userConfigStore.get(userConfigFavoritesStoreKey);
        if (userConfigFavorites) {
            this.store.set(this.favoritesStoreKey, userConfigFavorites);
            userConfigStore.delete(userConfigFavoritesStoreKey);
        }

        return userConfigFavorites;
    }

    public get(searchResultItem: SearchResultItem): Favorite | undefined {
        return this.favorites.find((f) => f.item.executionArgument === searchResultItem.executionArgument);
    }

    public getAll(): Favorite[] {
        return this.favorites;
    }

    public save(favorite: Favorite): void {
        this.favorites.push(favorite);
        this.store.set(this.favoritesStoreKey, this.favorites);
    }

    public update(favorite: Favorite): void {
        // tslint:disable-next-line: prefer-for-of because we need
        for (let i = 0; i < this.favorites.length; i++) {
            if (this.favorites[i].item.executionArgument === favorite.item.executionArgument) {
                this.favorites[i] = favorite;
                break;
            }
        }

        this.store.set(this.favoritesStoreKey, this.favorites);
    }

    public clearAll(): Promise<void> {
        return new Promise((resolve) => {
            this.favorites = [];
            this.store.set(this.favoritesStoreKey, this.favorites);
            resolve();
        });
    }
}
