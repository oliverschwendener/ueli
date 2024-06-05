import { useSetting } from "@Core/Hooks";
import type { ContextBridge, SearchResultItem } from "@common/Core";
import { useState } from "react";
import type { SearchFilter } from "./Helpers";
import { fuseJsSearchFilter } from "./Helpers/fuseJsSearchFilter";
import { fuzzySortFilter } from "./Helpers/fuzzySortFilter";
import { getFilteredSearchResultItems } from "./Helpers/getFilteredSearchResultItems";
import { getNextSearchResultItemId } from "./Helpers/getNextSearchResultItemId";
import { getPreviousSearchResultItemId } from "./Helpers/getPreviousSearchResultItemId";

type ViewModel = {
    searchTerm: string;
    selectedItemId: string;
    filteredSearchResultItems: SearchResultItem[];
};

type SearchViewControllerProps = {
    contextBridge: ContextBridge;
    searchResultItems: SearchResultItem[];
    excludedSearchResultItemIds: string[];
    favoriteSearchResultItemIds: string[];
};

export const useSearchViewcontroller = ({
    contextBridge,
    searchResultItems,
    excludedSearchResultItemIds,
    favoriteSearchResultItemIds,
}: SearchViewControllerProps) => {
    const [viewModel, setViewModel] = useState<ViewModel>({
        filteredSearchResultItems: [],
        searchTerm: "",
        selectedItemId: "",
    });

    const setSearchTerm = (searchTerm: string) => setViewModel({ ...viewModel, searchTerm });

    const setSelectedItemId = (selectedItemId: string) => setViewModel({ ...viewModel, selectedItemId });

    const setFilteredSearchResultItems = (filteredSearchResultItems: SearchResultItem[]) =>
        setViewModel({ ...viewModel, filteredSearchResultItems });

    const selectNextSearchResultItem = () =>
        setSelectedItemId(getNextSearchResultItemId(viewModel.selectedItemId, viewModel.filteredSearchResultItems));

    const selectPreviousSearchResultItem = () =>
        setSelectedItemId(getPreviousSearchResultItemId(viewModel.selectedItemId, viewModel.filteredSearchResultItems));

    const getSelectedSearchResultItem = (): SearchResultItem | undefined =>
        viewModel.filteredSearchResultItems.find((s) => s.id === viewModel.selectedItemId);

    const { value: fuzziness } = useSetting({ key: "searchEngine.fuzziness", defaultValue: 0.5 });
    const { value: maxSearchResultItems } = useSetting({ key: "searchEngine.maxResultLength", defaultValue: 50 });
    const { value: searchEngineId } = useSetting({ key: "searchEngine.id", defaultValue: "Fuse.js" });

    const searchFilters: Record<string, SearchFilter> = {
        "Fuse.js": (options) => fuseJsSearchFilter(options),
        fuzzysort: (options) => fuzzySortFilter(options),
    };

    const search = (searchTerm: string, selectedItemId?: string) => {
        const filteredSearchResultItems = getFilteredSearchResultItems({
            searchFilter: searchFilters[searchEngineId],
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
            selectedItemId: selectedItemId ?? filteredSearchResultItems[0]?.id,
            filteredSearchResultItems,
        });
    };

    return {
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
        filteredSearchResultItems: {
            set: setFilteredSearchResultItems,
            value: viewModel.filteredSearchResultItems,
            current: getSelectedSearchResultItem,
        },
    };
};
