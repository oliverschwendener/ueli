import { SearchResultItem } from "@common/SearchResultItem";
import { Button, Divider, Input } from "@fluentui/react-components";
import { Settings16Regular } from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FavoritesList } from "./FavoritesList";
import { filterSearchResultItemsBySearchTerm } from "./Helpers/filterSearchResultItemsBySearchTerm";
import { SearchResultList } from "./SearchResultList";

type SearchProps = {
    searchResultItems: SearchResultItem[];
};

export const Search = ({ searchResultItems }: SearchProps) => {
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const userInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const setFocusOnUserInput = () => userInputRef?.current?.focus();
    const navigate = useNavigate();
    const openSettings = () => navigate({ pathname: "/settings/general" });
    const search = (updatedSearchTerm: string) => setSearchTerm(updatedSearchTerm);

    const filteredSearchResultItems = filterSearchResultItemsBySearchTerm(searchResultItems, searchTerm);

    const selectNextSearchResultItem = () =>
        setSelectedItemIndex(selectedItemIndex === filteredSearchResultItems.length - 1 ? 0 : selectedItemIndex + 1);

    const selectPreviousSearchResultItem = () =>
        setSelectedItemIndex(selectedItemIndex === 0 ? filteredSearchResultItems.length - 1 : selectedItemIndex - 1);

    const selectFirstSearchResultItemItem = () => setSelectedItemIndex(0);

    useEffect(setFocusOnUserInput, []);
    useEffect(selectFirstSearchResultItemItem, [searchTerm]);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div
                className="draggable-area"
                style={{
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    padding: 10,
                    boxSizing: "border-box",
                }}
            >
                <Input
                    className="non-draggable-area"
                    ref={userInputRef}
                    appearance="filled-darker"
                    size="large"
                    value={searchTerm}
                    onChange={(_, { value }) => search(value)}
                    onKeyDown={(keyboardEvent) => {
                        if (keyboardEvent.key === "ArrowUp") {
                            keyboardEvent.preventDefault();
                            selectPreviousSearchResultItem();
                        }

                        if (keyboardEvent.key === "ArrowDown") {
                            keyboardEvent.preventDefault();
                            selectNextSearchResultItem();
                        }
                    }}
                />
            </div>
            <Divider />
            <div ref={containerRef} style={{ height: "100%", overflowY: "auto" }}>
                {searchTerm.length === 0 ? (
                    <FavoritesList />
                ) : (
                    <SearchResultList
                        containerRef={containerRef}
                        selectedItemIndex={selectedItemIndex}
                        searchResultItems={filteredSearchResultItems}
                    />
                )}
            </div>
            <Divider />
            <div
                style={{
                    flexShrink: 0,
                    padding: 10,
                    gap: 10,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                <Button onClick={openSettings} size="small" appearance="subtle" icon={<Settings16Regular />}>
                    Settings
                </Button>
            </div>
        </div>
    );
};
