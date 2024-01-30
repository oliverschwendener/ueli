import { BasicSearch } from "@Core/Components";
import type { ExtensionProps } from "@Core/ExtensionProps";
import { useExtensionSetting } from "@Core/Hooks";
import type { SearchResultItem } from "@common/Core";

export const WebSearchExtension = (props: ExtensionProps) => {
    const { contextBridge } = props;

    const { value: searchEngine } = useExtensionSetting<string>(
        "WebSearch",
        "searchEngine",
        contextBridge.getExtensionSettingDefaultValue("WebSearch", "searchEngine"),
    );

    const search = async (searchTerm: string) => {
        return searchTerm
            ? await contextBridge.invokeExtension<{ searchTerm: string }, SearchResultItem[]>("WebSearch", {
                  searchTerm,
              })
            : [];
    };

    return (
        <BasicSearch
            showGoBackButton
            getSearchResultItems={(term: string) => search(term)}
            inputPlaceholder={`Search ${searchEngine}`}
        />
    );
};
