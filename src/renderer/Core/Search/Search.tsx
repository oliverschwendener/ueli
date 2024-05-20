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
import { SearchFilter } from "./Helpers";
import { fuseJsSearchFilter } from "./Helpers/fuseJsSearchFilter";
import { fuzzySortFilter } from "./Helpers/fuzzySortFilter";
import { getNextSearchResultItemId } from "./Helpers/getNextSearchResultItemId";
import { getPreviousSearchResultItemId } from "./Helpers/getPreviousSearchResultItemId";
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
    const [selectedItemId, setSelectedItemId] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [confirmationDialogAction, setConfirmationDialogAction] = useState<SearchResultItemAction | undefined>(
        undefined,
    );
    const [instantSearchResultItems, setInstantSearchResultItems] = useState<SearchResultItem[]>([]);
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

    const search = (updatedSearchTerm: string) => {
        setSearchTerm(updatedSearchTerm);
        setInstantSearchResultItems(contextBridge.getInstantSearchResultItems(updatedSearchTerm));
    };

    const { value: singleClickBehavior } = useSetting({
        key: "keyboardAndMouse.singleClickBehavior",
        defaultValue: "selectSearchResultItem",
    });

    const { value: doubleClickBehavior } = useSetting({
        defaultValue: "invokeSearchResultItem",
        key: "keyboardAndMouse.doubleClickBehavior",
    });

    const { value: fuzziness } = useSetting({ key: "searchEngine.fuzziness", defaultValue: 0.5 });
    const { value: maxSearchResultItems } = useSetting({ key: "searchEngine.maxResultLength", defaultValue: 50 });

    const searchFilters: Record<string, SearchFilter> = {
        "Fuse.js": (options) => fuseJsSearchFilter(options),
        fuzzysort: (options) => fuzzySortFilter(options),
    };

    const searchFilter = searchFilters[contextBridge.getSettingValue("searchEngine.id", "Fuse.js")];

    const searchFilterItems = searchFilter({
        searchResultItems: searchResultItems.filter((s) => !excludedSearchResultItemIds.includes(s.id)),
        searchTerm: searchTerm.trim(),
        fuzziness,
        maxSearchResultItems,
    });

    const filteredSearchResultItems = [
        ...instantSearchResultItems,
        ...searchFilterItems.filter((s) => favorites.includes(s.id)),
        ...searchFilterItems.filter((s) => !favorites.includes(s.id)),
    ];

    const selectNextSearchResultItem = () =>
        setSelectedItemId(getNextSearchResultItemId(selectedItemId, filteredSearchResultItems));

    const selectPreviousSearchResultItem = () =>
        setSelectedItemId(getPreviousSearchResultItemId(selectedItemId, filteredSearchResultItems));

    const selectFirstSearchResultItemItem = () => setSelectedItemId(filteredSearchResultItems[0]?.id ?? "");

    const getSelectedSearchResultItem = (): SearchResultItem | undefined =>
        filteredSearchResultItems.find((s) => s.id === selectedItemId);

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

    const clickHandlers: Record<string, (s: SearchResultItem) => void> = {
        selectSearchResultItem: (s) => setSelectedItemId(s.id),
        invokeSearchResultItem: (s) => invokeAction(s.defaultAction),
    };

    const handleSearchResultItemClickEvent = (searchResultItem: SearchResultItem) => {
        clickHandlers[singleClickBehavior](searchResultItem);
    };

    const handleSearchResultItemDoubleClickEvent = (searchResultItem: SearchResultItem) => {
        clickHandlers[doubleClickBehavior](searchResultItem);
    };

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
                            selectedItemId={selectedItemId}
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
