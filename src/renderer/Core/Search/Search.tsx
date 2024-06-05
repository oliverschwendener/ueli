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
import { SearchFilter } from "./Helpers";
import { fuseJsSearchFilter } from "./Helpers/fuseJsSearchFilter";
import { fuzzySortFilter } from "./Helpers/fuzzySortFilter";
import { getFilteredSearchResultItems } from "./Helpers/getFilteredSearchResultItems";
import { getNextSearchResultItemId } from "./Helpers/getNextSearchResultItemId";
import { getPreviousSearchResultItemId } from "./Helpers/getPreviousSearchResultItemId";
import type { KeyboardEventHandler } from "./KeyboardEventHandler";
import { ScanIndicator } from "./ScanIndicator";
import { SearchResultList } from "./SearchResultList";

type SearchProps = {
    searchResultItems: SearchResultItem[];
    excludedSearchResultItemIds: string[];
    favoriteSearchResultItemIds: string[];
};

type ViewModel = {
    searchTerm: string;
    selectedItemId: string;
    filteredSearchResultItems: SearchResultItem[];
};

export const Search = ({
    searchResultItems,
    excludedSearchResultItemIds,
    favoriteSearchResultItemIds,
}: SearchProps) => {
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();

    const [viewModel, setViewModel] = useState<ViewModel>({
        filteredSearchResultItems: [],
        searchTerm: "",
        selectedItemId: "",
    });

    const [confirmationDialogAction, setConfirmationDialogAction] = useState<SearchResultItemAction | undefined>(
        undefined,
    );

    const userInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const additionalActionsButtonRef = useRef<HTMLButtonElement>(null);

    const setFocusOnUserInput = () => userInputRef?.current?.focus();

    const navigate = useNavigate();
    const openSettings = () => navigate({ pathname: "/settings/general" });

    const { value: singleClickBehavior } = useSetting({
        key: "keyboardAndMouse.singleClickBehavior",
        defaultValue: "selectSearchResultItem",
    });

    const { value: doubleClickBehavior } = useSetting({
        defaultValue: "invokeSearchResultItem",
        key: "keyboardAndMouse.doubleClickBehavior",
    });

    const selectNextSearchResultItem = () =>
        setViewModel({
            ...viewModel,
            selectedItemId: getNextSearchResultItemId(viewModel.selectedItemId, viewModel.filteredSearchResultItems),
        });

    const selectPreviousSearchResultItem = () =>
        setViewModel({
            ...viewModel,
            selectedItemId: getPreviousSearchResultItemId(
                viewModel.selectedItemId,
                viewModel.filteredSearchResultItems,
            ),
        });

    const getSelectedSearchResultItem = (): SearchResultItem | undefined =>
        viewModel.filteredSearchResultItems.find((s) => s.id === viewModel.selectedItemId);

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
                listener: () => contextBridge.ipcRenderer.send("escapePressed"),
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.key === "Escape",
            },
            {
                listener: () => selectPreviousSearchResultItem(),
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.key === "ArrowUp",
            },
            {
                listener: () => selectNextSearchResultItem(),
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.key === "ArrowDown",
            },
            {
                listener: () => additionalActionsButtonRef.current?.click(),
                needsToInvokeListener: (keyboardEvent) =>
                    keyboardEvent.key === "k" && (keyboardEvent.metaKey || keyboardEvent.ctrlKey),
            },
            {
                listener: async () => await invokeSelectedSearchResultItem(),
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.key === "Enter",
            },
        ];

        for (const eventHandler of eventHandlers) {
            if (eventHandler.needsToInvokeListener(keyboardEvent)) {
                keyboardEvent.preventDefault();
                eventHandler.listener();
            }
        }
    };

    const clickHandlers: Record<string, (s: SearchResultItem) => void> = {
        selectSearchResultItem: (s) => setViewModel({ ...viewModel, selectedItemId: s.id }),
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

    const { value: fuzziness } = useSetting({ key: "searchEngine.fuzziness", defaultValue: 0.5 });
    const { value: maxSearchResultItems } = useSetting({ key: "searchEngine.maxResultLength", defaultValue: 50 });

    const searchFilters: Record<string, SearchFilter> = {
        "Fuse.js": (options) => fuseJsSearchFilter(options),
        fuzzysort: (options) => fuzzySortFilter(options),
    };

    const search = (searchTerm: string, selectedItemId?: string) => {
        const filteredSearchResultItems = getFilteredSearchResultItems({
            searchFilter: searchFilters[contextBridge.getSettingValue("searchEngine.id", "Fuse.js")],
            excludedSearchResultItemIds,
            favoriteSearchResultItemIds,
            fuzziness,
            instantSearchResultItems: contextBridge.getInstantSearchResultItems(searchTerm),
            maxSearchResultItems,
            searchResultItems,
            searchTerm,
        });

        setViewModel({
            ...viewModel,
            ...{
                searchTerm,
                selectedItemId: selectedItemId ?? filteredSearchResultItems[0]?.id,
                filteredSearchResultItems,
            },
        });
    };

    useEffect(() => {
        const setFocusOnUserInputAndSelectText = () => {
            userInputRef?.current?.focus();
            userInputRef?.current?.select();
        };

        setFocusOnUserInputAndSelectText();

        contextBridge.ipcRenderer.on("windowFocused", () => setFocusOnUserInputAndSelectText());
    }, []);

    useEffect(() => {
        search(viewModel.searchTerm, viewModel.selectedItemId);
    }, [searchResultItems]);

    useEffect(() => {
        search(viewModel.searchTerm);
    }, [favoriteSearchResultItemIds, excludedSearchResultItemIds]);

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
                        value={viewModel.searchTerm}
                        onChange={(_, { value }) => search(value)}
                        onKeyDown={handleUserInputKeyDownEvent}
                        contentBefore={<SearchRegular />}
                        placeholder={t("placeholder", { ns: "search" })}
                    />
                </div>
            }
            contentRef={containerRef}
            content={
                contextBridge.getScanCount() === 0 ? (
                    <ScanIndicator />
                ) : (
                    <>
                        <ConfirmationDialog closeDialog={closeConfirmationDialog} action={confirmationDialogAction} />
                        <SearchResultList
                            containerRef={containerRef}
                            selectedItemId={viewModel.selectedItemId}
                            searchResultItems={viewModel.filteredSearchResultItems}
                            favorites={favoriteSearchResultItemIds}
                            searchTerm={viewModel.searchTerm}
                            onSearchResultItemClick={handleSearchResultItemClickEvent}
                            onSearchResultItemDoubleClick={handleSearchResultItemDoubleClickEvent}
                        />
                    </>
                )
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
                        favorites={favoriteSearchResultItemIds}
                        invokeAction={invokeAction}
                        additionalActionsButtonRef={additionalActionsButtonRef}
                        onMenuClosed={() => setFocusOnUserInput()}
                    />
                </Footer>
            }
        />
    );
};
