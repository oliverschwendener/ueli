import type { SearchResultItem } from "@common/SearchResultItem";
import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import { Button, Divider, Input } from "@fluentui/react-components";
import { Settings16Regular } from "@fluentui/react-icons";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useContextBridge, useSetting } from "../Hooks";
import { ActionsMenu } from "./ActionsMenu";
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
    const additionalActionsButtonRef = useRef<HTMLButtonElement>(null);
    const [additionalActions, setAdditionalActions] = useState<SearchResultItemAction[]>([]);

    const setFocusOnUserInput = () => {
        userInputRef?.current?.focus();
    };

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

    const invokeSelectedSearchResultItem = async () => {
        const searchResultItem = getSelectedSearchResultItem();

        if (!searchResultItem || !searchResultItem.defaultAction) {
            return;
        }

        await invokeAction(searchResultItem.defaultAction);
    };

    const invokeAction = (action: SearchResultItemAction) => contextBridge.invokeAction(action);

    const handleUserInputKeyboardEvent = (keyboardEvent: KeyboardEvent) => {
        if (keyboardEvent.key === "ArrowUp") {
            keyboardEvent.preventDefault();
            selectPreviousSearchResultItem();
            return;
        }

        if (keyboardEvent.key === "ArrowDown") {
            keyboardEvent.preventDefault();
            selectNextSearchResultItem();
            return;
        }

        if (keyboardEvent.key === "Enter") {
            invokeSelectedSearchResultItem();
            return;
        }

        if (keyboardEvent.key === "k" && (keyboardEvent.metaKey || keyboardEvent.ctrlKey)) {
            additionalActionsButtonRef.current?.click();
        }
    };

    const handleSearchResultItemClickEvent = (index: number) => setSelectedItemIndex(index);

    const handleSearchResultItemDoubleClickEvent = (searchResultItem: SearchResultItem) =>
        searchResultItem.defaultAction && invokeAction(searchResultItem.defaultAction);

    const updateAdditionalActions = () => {
        const searchResultItem = getSelectedSearchResultItem();

        if (!searchResultItem) {
            setAdditionalActions([]);
            return;
        }

        setAdditionalActions([searchResultItem.defaultAction, ...(searchResultItem.additionalActions ?? [])]);
    };

    useEffect(() => {
        setFocusOnUserInputAndSelectText();
        window.ContextBridge.windowFocused(() => setFocusOnUserInputAndSelectText());
    }, []);

    useEffect(() => selectFirstSearchResultItemItem(), [searchTerm]);
    useEffect(() => updateAdditionalActions(), [selectedItemIndex, searchTerm]);

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
                    justifyContent: "space-between",
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
                <ActionsMenu
                    actions={additionalActions}
                    invokeAction={invokeAction}
                    additionalActionsButtonRef={additionalActionsButtonRef}
                    onMenuClosed={() => setFocusOnUserInput()}
                />
            </div>
        </div>
    );
};
