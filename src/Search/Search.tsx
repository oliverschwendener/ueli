import { SearchResultItem } from "@common/SearchResultItem";
import { Button, Divider, Input, ProgressBar } from "@fluentui/react-components";
import { Settings16Filled } from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FavoritesList } from "./FavoritesList";
import { SearchResultList } from "./SearchResultList";
import { filterSearchResultItemsBySearchTerm } from "./helpers";

type SearchProps = {
    rescanState: { rescanPending: boolean };
    searchResultItems: SearchResultItem[];
};

export const Search = ({ rescanState, searchResultItems }: SearchProps) => {
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
                    size="small"
                    value={searchTerm}
                    onChange={(_, { value }) => search(value)}
                    onKeyDown={(keyboardEvent) => {
                        if (keyboardEvent.key === "ArrowUp") {
                            selectPreviousSearchResultItem();
                        }

                        if (keyboardEvent.key === "ArrowDown") {
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
            {rescanState.rescanPending ? <ProgressBar /> : null}
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
                <Button onClick={openSettings} size="small" appearance="subtle" icon={<Settings16Filled />}>
                    Settings
                </Button>
            </div>
        </div>
    );
};
