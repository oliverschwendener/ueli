export type SearchResultItem = {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
};

export interface Searchable {
    toSearchResultItem(): SearchResultItem;
}
