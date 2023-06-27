import { FC } from "react";

type SearchResultListItemProps = {
    id: number;
};

export const SearchResultListItem: FC<SearchResultListItemProps> = ({ id }) => {
    return <div>Search Result Item #{id}</div>;
};
