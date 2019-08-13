import { SearchResultItem } from "../../common/search-result-item";
import { Favorite } from "./favorite";

export interface FavoriteRepository {
    get(searchResultItem: SearchResultItem): Favorite | undefined;
    getAll(): Favorite[];
    save(favorite: Favorite): void;
    update(favorite: Favorite): void;
    clearAll(): Promise<void>;
}
