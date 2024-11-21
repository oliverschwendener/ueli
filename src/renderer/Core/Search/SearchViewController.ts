import { useSetting } from "@Core/Hooks";
import type { ContextBridge, SearchResultItem, SearchResultItemAction } from "@common/Core";
import type { SearchEngineId } from "@common/Core/Search";
import { useRef, useState } from "react";
import { getNextSearchResultItemId } from "./Helpers/getNextSearchResultItemId";
import { getPreviousSearchResultItemId } from "./Helpers/getPreviousSearchResultItemId";
import { getSearchResult } from "./Helpers/getSearchResult";

type ViewModel = {
    searchTerm: string;
    selectedItemId: string;
    searchResult: Record<string, SearchResultItem[]>;
};

type SearchViewControllerProps = {
    contextBridge: ContextBridge;
    searchResultItems: SearchResultItem[];
    excludedSearchResultItemIds: string[];
    favoriteSearchResultItemIds: string[];
};

const collectSearchResultItems = (searchResult: Record<string, SearchResultItem[]>) => {
    const result = [];

    for (const key of Object.keys(searchResult)) {
        result.push(...searchResult[key]);
    }

    return result;
};

export const useSearchViewController = ({
    contextBridge,
    searchResultItems,
    excludedSearchResultItemIds,
    favoriteSearchResultItemIds,
}: SearchViewControllerProps) => {
    const [viewModel, setViewModel] = useState<ViewModel>({
        searchResult: {},
        searchTerm: "",
        selectedItemId: "",
    });

    const userInputRef = useRef<HTMLInputElement>(null);

    const setSearchTerm = (searchTerm: string) => setViewModel({ ...viewModel, searchTerm });

    const setSelectedItemId = (selectedItemId: string) => setViewModel({ ...viewModel, selectedItemId });

    const setSearchResult = (searchResult: Record<string, SearchResultItem[]>) =>
        setViewModel({ ...viewModel, searchResult });

    const selectNextSearchResultItem = () =>
        setSelectedItemId(
            getNextSearchResultItemId(viewModel.selectedItemId, collectSearchResultItems(viewModel.searchResult)),
        );

    const selectPreviousSearchResultItem = () =>
        setSelectedItemId(
            getPreviousSearchResultItemId(viewModel.selectedItemId, collectSearchResultItems(viewModel.searchResult)),
        );

    const getSelectedSearchResultItem = (): SearchResultItem | undefined =>
        collectSearchResultItems(viewModel.searchResult).find((s) => s.id === viewModel.selectedItemId);

    const { value: fuzziness } = useSetting({ key: "searchEngine.fuzziness", defaultValue: 0.5 });
    const { value: maxSearchResultItems } = useSetting({ key: "searchEngine.maxResultLength", defaultValue: 50 });
    const { value: searchEngineId } = useSetting<SearchEngineId>({ key: "searchEngine.id", defaultValue: "fuzzysort" });

    const search = (searchTerm: string, selectedItemId?: string) => {
        const searchResult = getSearchResult({
            searchEngineId,
            excludedSearchResultItemIds,
            favoriteSearchResultItemIds,
            fuzziness,
            instantSearchResultItems: contextBridge.getInstantSearchResultItems(searchTerm),
            maxSearchResultItems,
            searchResultItems,
            searchTerm,
        });

        setViewModel({
            searchTerm,
            selectedItemId: selectedItemId ?? collectSearchResultItems(searchResult)[0]?.id,
            searchResult,
        });
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
