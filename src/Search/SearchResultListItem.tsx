import { SearchResultItem } from "@common/SearchResultItem";
import { Text } from "@fluentui/react-components";

type SearchResultListItemProps = {
    searchResultItem: SearchResultItem;
};

export const SearchResultListItem = ({ searchResultItem }: SearchResultListItemProps) => {
    return (
        <div
            key={searchResultItem.id}
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
    );
};
