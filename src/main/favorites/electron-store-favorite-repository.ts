import { FavoriteRepository } from "./favorite-repository";
import { Favorite } from "./favorite";
import { SearchResultItem } from "../../common/search-result-item";
import Store = require("electron-store");

export class ElectronStoreFavoriteRepository implements FavoriteRepository {
    private readonly store: Store<Favorite[]>;
    private readonly favoritesStoreKey = "favorites";
    private favorites: Favorite[];

    constructor() {
        this.store = new Store<Favorite[]>({ name: "favorites" });
        this.favorites = this.store.get(this.favoritesStoreKey) || [];
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
