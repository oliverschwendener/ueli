import { type SearchResultItem, type SearchResultItemAction } from "@common/Core";
import { Button, Input } from "@fluentui/react-components";
import { SearchRegular, SettingsRegular } from "@fluentui/react-icons";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { BaseLayout } from "../BaseLayout";
import { Footer } from "../Footer";
import { useContextBridge, useSetting } from "../Hooks";
import { ActionsMenu } from "./ActionsMenu";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { FavoritesList } from "./FavoritesList";
import { filterSearchResultItemsBySearchTerm } from "./Helpers";
import type { KeyboardEventHandler } from "./KeyboardEventHandler";
import { SearchResultList } from "./SearchResultList";

type SearchProps = {
    searchResultItems: SearchResultItem[];
    excludedSearchResultItemIds: string[];
    favorites: string[];
};

export const Search = ({ searchResultItems, excludedSearchResultItemIds, favorites }: SearchProps) => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();
    const [selectedSearchResultItemIndex, setSelectedSearchResultItemIndex] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [confirmationDialogAction, setConfirmationDialogAction] = useState<SearchResultItemAction | undefined>(
        undefined,
    );
    const userInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const additionalActionsButtonRef = useRef<HTMLButtonElement>(null);

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

    const { value: fuzziness } = useSetting("searchEngine.fuzziness", 0.5);
    const { value: maxResultLength } = useSetting("searchEngine.maxResultLength", 50);

    const filteredSearchResultItems = filterSearchResultItemsBySearchTerm({
        searchResultItems,
        excludedIds: excludedSearchResultItemIds,
        searchOptions: { searchTerm, fuzziness, maxResultLength },
    });

    const selectNextSearchResultItem = () =>
        setSelectedSearchResultItemIndex(
            selectedSearchResultItemIndex === filteredSearchResultItems.length - 1
                ? 0
                : selectedSearchResultItemIndex + 1,
        );

    const selectPreviousSearchResultItem = () =>
        setSelectedSearchResultItemIndex(
            selectedSearchResultItemIndex === 0
                ? filteredSearchResultItems.length - 1
                : selectedSearchResultItemIndex - 1,
        );

    const selectFirstSearchResultItemItem = () => setSelectedSearchResultItemIndex(0);

    const getSelectedSearchResultItem = (): SearchResultItem | undefined =>
        filteredSearchResultItems[selectedSearchResultItemIndex];

    const invokeSelectedSearchResultItem = async () => {
        const searchResultItem = getSelectedSearchResultItem();

        if (!searchResultItem || !searchResultItem.defaultAction) {
            return;
        }

        await invokeAction(searchResultItem.defaultAction);
    };

    const invokeAction = async (action: SearchResultItemAction) => {
        if (!action.requiresConfirmation) {
            await contextBridge.invokeAction(action);
            return;
        }

        // This timeout is a workaround. Without it, for some reason the close button in the confirmation dialog will
        // trigger an "onClick" event and therefore will be closed immediately.
        setTimeout(() => setConfirmationDialogAction(action), 100);
    };

    const handleUserInputKeyDownEvent = (keyboardEvent: KeyboardEvent<HTMLElement>) => {
        const eventHandlers: KeyboardEventHandler[] = [
            {
                listener: (e) => {
                    e.preventDefault();
                    selectPreviousSearchResultItem();
                },
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.key === "ArrowUp",
            },
            {
                listener: (e) => {
                    e.preventDefault();
                    selectNextSearchResultItem();
                },
                needsToInvokeListener: (e) => e.key === "ArrowDown",
            },
            {
                listener: (e) => {
                    e.preventDefault();
                    additionalActionsButtonRef.current?.click();
                },
                needsToInvokeListener: (e) => e.key === "k" && (e.metaKey || e.ctrlKey),
            },
            {
                listener: async (e) => {
                    e.preventDefault();
                    await invokeSelectedSearchResultItem();
                },
                needsToInvokeListener: (e) => e.key === "Enter",
            },
        ];

        for (const eventHandler of eventHandlers) {
            if (eventHandler.needsToInvokeListener(keyboardEvent)) {
                eventHandler.listener(keyboardEvent);
            }
        }
    };

    const handleSearchResultItemClickEvent = (index: number) => setSelectedSearchResultItemIndex(index);

    const handleSearchResultItemDoubleClickEvent = (searchResultItem: SearchResultItem) =>
        searchResultItem.defaultAction && invokeAction(searchResultItem.defaultAction);

    const closeConfirmationDialog = () => {
        setConfirmationDialogAction(undefined);
        setFocusOnUserInput();
    };

    const hasSearchTerm = !!searchTerm.length;

    useEffect(() => {
        setFocusOnUserInputAndSelectText();
        contextBridge.ipcRenderer.on("windowFocused", () => setFocusOnUserInputAndSelectText());
    }, []);

    useEffect(() => selectFirstSearchResultItemItem(), [searchTerm]);

    return (
        <BaseLayout
            header={
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
                        appearance={contextBridge.themeShouldUseDarkColors() ? "filled-darker" : "filled-lighter"}
                        size="large"
                        value={searchTerm}
                        onChange={(_, { value }) => search(value)}
                        onKeyDown={handleUserInputKeyDownEvent}
                        contentBefore={<SearchRegular />}
                        placeholder={t("placeholder", { ns: "search" })}
                    />
                </div>
            }
            contentRef={containerRef}
            content={
                <>
                    <ConfirmationDialog closeDialog={closeConfirmationDialog} action={confirmationDialogAction} />
                    {hasSearchTerm ? (
                        <SearchResultList
                            containerRef={containerRef}
                            selectedItemIndex={selectedSearchResultItemIndex}
                            searchResultItems={filteredSearchResultItems}
                            favorites={favorites}
                            searchTerm={searchTerm}
                            onSearchResultItemClick={handleSearchResultItemClickEvent}
                            onSearchResultItemDoubleClick={handleSearchResultItemDoubleClickEvent}
                        />
                    ) : (
                        <FavoritesList invokeSearchResultItem={({ defaultAction }) => invokeAction(defaultAction)} />
                    )}
                </>
            }
            footer={
                <Footer draggable>
                    <Button
                        className="non-draggable-area"
                        onClick={openSettings}
                        size="small"
                        appearance="subtle"
                        icon={<SettingsRegular fontSize={14} />}
                    >
                        {t("settings", { ns: "general" })}
                    </Button>
                    <ActionsMenu
                        searchResultItem={getSelectedSearchResultItem()}
                        favorites={favorites}
                        invokeAction={invokeAction}
                        additionalActionsButtonRef={additionalActionsButtonRef}
                        onMenuClosed={() => setFocusOnUserInput()}
                    />
                </Footer>
            }
        />
    );
};
