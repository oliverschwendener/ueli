import { BasicSearch } from "@Core/Components";
import type { ExtensionProps } from "@Core/ExtensionProps";
import { SearchResultItem } from "@common/Core";

type InvokationArgument = {
    searchTerm: string;
};

type InvokationResponse = Promise<SearchResultItem[]>;

export const FileSearch = ({ contextBridge }: ExtensionProps) => {
    const getSearchResultItems = async (searchTerm: string) => {
        try {
            const searchResultItems = await contextBridge.invokeExtension<InvokationArgument, InvokationResponse>(
                "FileSearch",
                { searchTerm },
            );
            return searchResultItems;
        } catch (error) {
            console.log(`error: ${error}`);
            return [];
        }
    };

    return <BasicSearch getSearchResultItems={getSearchResultItems} showGoBackButton />;
};
