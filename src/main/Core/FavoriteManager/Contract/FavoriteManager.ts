import type { SearchResultItem } from "@common/Core";

export interface FavoriteManager {
    add(favorite: SearchResultItem): Promise<void>;
    remove(id: string): Promise<void>;
    getAll(): SearchResultItem[];
}
