import { FavoriteRepository } from "./favorite-repository";
import { Favorite } from "./favorite";
import { SearchResultItem } from "../../common/search-result-item";
import Store = require("electron-store");

export class ElectronStoreFavoriteRepository implements FavoriteRepository {
    private readonly store: Store<Record<string, Favorite[] | undefined>>;
    private readonly favoritesStoreKey = "favorites";
    private favorites: Favorite[];

    constructor() {
        this.store = new Store({ name: "favorites" });

        this.favorites = this.migrateUserConfigFavorites() || this.store.get(this.favoritesStoreKey) || [];
    }

    private migrateUserConfigFavorites(): Favorite[] | undefined {
        // Favorites were moved from the user config store to their own store.
        // If favorites found in the user config store, migrate them.
        const userConfigStore = new Store<Record<string, Favorite[] | undefined>>();
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

    public update(favoriteToUpdate: Favorite): void {
        this.favorites = this.favorites.map((favorite) =>
            favorite.item.executionArgument === favoriteToUpdate.item.executionArgument ? favoriteToUpdate : favorite,
        );

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
