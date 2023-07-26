import { SearchResultItem } from "@common/SearchResultItem";
import { SearchResultListItem } from "./SearchResultListItem";

type SearchResultListProps = {
    searchTerm: string;
    searchResultItems: SearchResultItem[];
};

const filterSearchResultItemsBySearchTerm = (searchResultItems: SearchResultItem[], searchTerm: string) =>
    searchResultItems.filter((searchResultItem) =>
        `${searchResultItem.name.toLowerCase()}${searchResultItem.description.toLowerCase()}`.includes(
            searchTerm.trim().toLowerCase(),
        ),
    );

export const SearchResultList = ({ searchTerm, searchResultItems }: SearchResultListProps) => {
    const filteredSearchResultItems = filterSearchResultItemsBySearchTerm(searchResultItems, searchTerm);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                paddingTop: 10,
                paddingBottom: 10,
            }}
        >
            {filteredSearchResultItems.map((searchResultItem) => (
                <SearchResultListItem key={searchResultItem.id} searchResultItem={searchResultItem} />
            ))}
        </div>
    );
};
