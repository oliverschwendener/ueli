import { SearchResultItem } from "../../common/search-result-item";

export interface Favorite {
    item: SearchResultItem;
    executionCount: number;
    keyword: FavoriteKeyword;
}

export interface FavoriteKeyword {
    [key: string]: number;
}
