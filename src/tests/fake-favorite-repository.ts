import { FavoriteRepository } from "../main/favorites/favorite-repository";
import { Favorite } from "../main/favorites/favorite";
import { SearchResultItem } from "../common/search-result-item";

export class FakeFavoriteRepository implements FavoriteRepository {
    private favorites: Favorite[];

    constructor(favorites: Favorite[]) {
        this.favorites = favorites;
    }

    public get(searchResultItem: SearchResultItem): Favorite | undefined {
        return this.favorites.find((f) => f.item.executionArgument === searchResultItem.executionArgument);
    }

    public getAll(): Favorite[] {
        return this.favorites;
    }

    public save(favorite: Favorite): void {
        this.favorites.push(favorite);
    }

    public update(favorite: Favorite): void {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.favorites.length; i++) {
            if (this.favorites[i].item.executionArgument === favorite.item.executionArgument) {
                this.favorites[i].item = favorite.item;
                break;
            }
        }
    }

    public clearAll(): Promise<void> {
        return new Promise((resolve) => {
            this.favorites = [];
            resolve();
        });
    }
}
