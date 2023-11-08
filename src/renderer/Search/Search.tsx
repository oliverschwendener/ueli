import { SearchResultItem } from "@common/SearchResultItem";
import { SearchResultItemAction } from "@common/SearchResultItemAction";
import { Button, Divider, Input } from "@fluentui/react-components";
import { Settings16Regular } from "@fluentui/react-icons";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useContextBridge, useSetting } from "../Hooks";
import { FavoritesList } from "./FavoritesList";
import { filterSearchResultItemsBySearchTerm } from "./Helpers";
import { SearchResultList } from "./SearchResultList";

type SearchProps = {
    searchResultItems: SearchResultItem[];
};

export const Search = ({ searchResultItems }: SearchProps) => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const userInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const setFocusOnUserInputAndSelectText = () => {
        userInputRef?.current?.focus();
        userInputRef?.current?.select();
    };

    const navigate = useNavigate();
    const openSettings = () => navigate({ pathname: "/settings/general" });
    const search = (updatedSearchTerm: string) => setSearchTerm(updatedSearchTerm);
    const { value: fuzzyness } = useSetting("searchEngine.fuzzyness", 0.6);

    const filteredSearchResultItems = filterSearchResultItemsBySearchTerm(searchResultItems, { searchTerm, fuzzyness });

    const selectNextSearchResultItem = () =>
        setSelectedItemIndex(selectedItemIndex === filteredSearchResultItems.length - 1 ? 0 : selectedItemIndex + 1);

    const selectPreviousSearchResultItem = () =>
        setSelectedItemIndex(selectedItemIndex === 0 ? filteredSearchResultItems.length - 1 : selectedItemIndex - 1);

    const selectFirstSearchResultItemItem = () => setSelectedItemIndex(0);

    const getSelectedSearchResultItem = (): SearchResultItem | undefined =>
        filteredSearchResultItems[selectedItemIndex];

    const invokeExecution = (action: SearchResultItemAction) => contextBridge.invokeAction(action);

    const handleUserInputKeyboardEvent = async (keyboardEvent: KeyboardEvent) => {
        if (keyboardEvent.key === "ArrowUp") {
            keyboardEvent.preventDefault();
            selectPreviousSearchResultItem();
        }

        if (keyboardEvent.key === "ArrowDown") {
            keyboardEvent.preventDefault();
            selectNextSearchResultItem();
        }

        if (keyboardEvent.key === "Enter") {
            const searchResultItem = getSelectedSearchResultItem();

            if (!searchResultItem || !searchResultItem.defaultAction) {
                return;
            }

            await invokeExecution(searchResultItem.defaultAction);
        }
    };

    const handleSearchResultItemClickEvent = (index: number) => setSelectedItemIndex(index);

    const handleSearchResultItemDoubleClickEvent = (searchResultItem: SearchResultItem) =>
        searchResultItem.defaultAction && invokeExecution(searchResultItem.defaultAction);

    useEffect(() => {
        setFocusOnUserInputAndSelectText();
        window.ContextBridge.windowFocused(() => setFocusOnUserInputAndSelectText());
    }, []);

    useEffect(selectFirstSearchResultItemItem, [searchTerm]);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div
                className="draggable-area"
                style={{
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 0,
                    padding: 10,
                }}
            >
                <Input
                    className="non-draggable-area"
                    ref={userInputRef}
                    appearance="filled-darker"
                    size="large"
                    value={searchTerm}
                    onChange={(_, { value }) => search(value)}
                    onKeyDown={handleUserInputKeyboardEvent}
                />
            </div>
            <Divider appearance="subtle" />
            <div ref={containerRef} style={{ height: "100%", overflowY: "scroll" }}>
                {searchTerm.length === 0 ? (
                    <FavoritesList />
                ) : (
                    <SearchResultList
                        containerRef={containerRef}
                        selectedItemIndex={selectedItemIndex}
                        searchResultItems={filteredSearchResultItems}
                        onSearchResultItemClick={handleSearchResultItemClickEvent}
                        onSearchResultItemDoubleClick={handleSearchResultItemDoubleClickEvent}
                    />
                )}
            </div>
            <Divider appearance="subtle" />
            <div
                className="draggable-area"
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
                <Button
                    className="non-draggable-area"
                    onClick={openSettings}
                    size="small"
                    appearance="subtle"
                    icon={<Settings16Regular />}
                >
                    {t("general.settings")}
                </Button>
            </div>
        </div>
    );
};
