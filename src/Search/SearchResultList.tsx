import { FC } from "react";
import { SearchResultListItem } from "./SearchResultListItem";

type SearchResultListProps = {
    numberOfSearchResults: number;
};

const createArrayOfIds = (length: number) => Array.from({ length }, (_, i) => i);

export const SearchResultList: FC<SearchResultListProps> = ({ numberOfSearchResults }) => {
    const ids: number[] = createArrayOfIds(numberOfSearchResults);

    return (
        <div>
            {ids.map((id) => (
                <SearchResultListItem id={id} key={`search-result-list-item-${id}`} />
            ))}
        </div>
    );
};
