import type { OperatingSystem, SearchResultItem, SearchResultItemAction } from "@common/Core";
import type { SearchEngineId } from "@common/Core/Search";
import { useRef, useState } from "react";
import { getActions, getNextSearchResultItemId, getPreviousSearchResultItemId } from "./Helpers";
import { getSearchResult } from "./Helpers/getSearchResult";

type ViewModel = {
    searchTerm: string;
    selectedItemId: string;
    searchResult: Record<string, SearchResultItem[]>;
};

type SearchViewControllerProps = {
    searchResultItems: SearchResultItem[];
    excludedSearchResultItemIds: string[];
    favoriteSearchResultItemIds: string[];
    operatingSystem: OperatingSystem;
};

const keyboardShortcuts: Record<OperatingSystem, Record<"addToFavorites" | "excludeFromSearchResults", string>> = {
    Linux: {
        addToFavorites: "Ctrl+F",
        excludeFromSearchResults: "Ctrl+Delete",
    },
    macOS: {
        addToFavorites: "Cmd+F",
        excludeFromSearchResults: "Cmd+Delete",
    },
    Windows: {
        addToFavorites: "Ctrl+F",
        excludeFromSearchResults: "Ctrl+Delete",
    },
};

const flattenSearchResult = (searchResult: Record<string, SearchResultItem[]>): SearchResultItem[] =>
    Object.values(searchResult).flat();

export const useSearchViewController = ({
    searchResultItems,
    excludedSearchResultItemIds,
    favoriteSearchResultItemIds,
    operatingSystem,
}: SearchViewControllerProps) => {
    const [viewModel, setViewModel] = useState<ViewModel>({
        searchResult: {},
        searchTerm: "",
        selectedItemId: "",
    });

    const userInputRef = useRef<HTMLInputElement>(null);

    const setSearchTerm = (searchTerm: string) => setViewModel((prev) => ({ ...prev, searchTerm }));

    const setSelectedItemId = (selectedItemId: string) => setViewModel((prev) => ({ ...prev, selectedItemId }));

    const setSearchResult = (searchResult: Record<string, SearchResultItem[]>) =>
        setViewModel((prev) => ({ ...prev, searchResult }));

    const selectNextSearchResultItem = () =>
        setSelectedItemId(
            getNextSearchResultItemId(viewModel.selectedItemId, flattenSearchResult(viewModel.searchResult)),
        );

    const selectPreviousSearchResultItem = () =>
        setSelectedItemId(
            getPreviousSearchResultItemId(viewModel.selectedItemId, flattenSearchResult(viewModel.searchResult)),
        );

    const getSelectedSearchResultItem = (): SearchResultItem | undefined =>
        flattenSearchResult(viewModel.searchResult).find((s) => s.id === viewModel.selectedItemId);

    const getSelectedSearchResultItemActions = (): SearchResultItemAction[] => {
        const selectedSearchResultItem = getSelectedSearchResultItem();
        return selectedSearchResultItem
            ? getActions(selectedSearchResultItem, favoriteSearchResultItemIds, keyboardShortcuts[operatingSystem])
            : [];
    };

    const search = (searchTerm: string, selectedItemId?: string) => {
        const fuzziness = window.ContextBridge.getSettingValue("searchEngine.fuzziness", 0.5);
        const maxSearchResultItems = window.ContextBridge.getSettingValue("searchEngine.maxResultLength", 50);
        const searchEngineId = window.ContextBridge.getSettingValue<SearchEngineId>("searchEngine.id", "fuzzysort");

        const searchResult = getSearchResult({
            searchEngineId,
            excludedSearchResultItemIds,
            favoriteSearchResultItemIds,
            fuzziness,
            instantSearchResultItems: window.ContextBridge.getInstantSearchResultItems(searchTerm),
            maxSearchResultItems,
            searchResultItems,
            searchTerm,
        });

        setViewModel((prev) => ({
            ...prev,
            searchTerm,
            selectedItemId: selectedItemId ?? flattenSearchResult(searchResult)[0]?.id,
            searchResult,
        }));
    };

    const focusUserInput = () => userInputRef.current?.focus();
    const selectUserInput = () => userInputRef.current?.select();

    const [confirmationDialogAction, setConfirmationDialogAction] = useState<SearchResultItemAction | undefined>(
        undefined,
    );

    const invokeSelectedSearchResultItem = async () => {
        const searchResultItem = getSelectedSearchResultItem();

        if (!searchResultItem || !searchResultItem.defaultAction) {
            return;
        }

        await invokeAction({
            action: searchResultItem.defaultAction,
            confirmed: !searchResultItem.defaultAction.requiresConfirmation,
        });
    };

    const invokeAction = async ({ action, confirmed }: { action: SearchResultItemAction; confirmed: boolean }) => {
        if (confirmed) {
            const preserveUserInput = window.ContextBridge.getSettingValue("general.preserveUserInput", true);

            if (!preserveUserInput) {
                search("");
            }

            await window.ContextBridge.invokeAction(action);
            return;
        }

        // This timeout is a workaround. Without it, for some reason the close button in the confirmation dialog will
        // trigger an "onClick" event and therefore will be closed immediately.
        setTimeout(() => setConfirmationDialogAction(action), 100);
    };

    return {
        invokeAction,
        invokeSelectedSearchResultItem,
        search,
        searchTerm: {
            set: setSearchTerm,
            value: viewModel.searchTerm,
        },
        selectedItemId: {
            set: setSelectedItemId,
            value: viewModel.selectedItemId,
            next: selectNextSearchResultItem,
            previous: selectPreviousSearchResultItem,
        },
        searchResult: {
            value: viewModel.searchResult,
            set: setSearchResult,
            current: () => getSelectedSearchResultItem(),
            currentActions: () => getSelectedSearchResultItemActions(),
        },
        userInput: {
            ref: userInputRef,
            focus: focusUserInput,
            select: selectUserInput,
        },
        confirmationDialog: {
            action: {
                set: setConfirmationDialogAction,
                reset: () => setConfirmationDialogAction(undefined),
                value: confirmationDialogAction,
            },
        },
    };
};
