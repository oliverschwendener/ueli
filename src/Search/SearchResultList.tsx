import { SearchResultItem } from "@common/SearchResultItem";
import { Text } from "@fluentui/react-components";

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
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 10, paddingBottom: 10 }}>
            {filterSearchResultItemsBySearchTerm(searchResultItems, searchTerm).map((searchResultItem) => (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingLeft: 10,
                        paddingRight: 10,
                        boxSizing: "border-box",
                    }}
                >
                    <Text weight="semibold" size={400}>
                        {searchResultItem.name}
                    </Text>
                    <Text weight="regular">{searchResultItem.description}</Text>
                </div>
            ))}
        </div>
    );
};
