import { BasicSearch } from "@Core/Components";
import type { ExtensionProps } from "@Core/ExtensionProps";
import { useExtensionSetting } from "@Core/Hooks";
import { SearchResultItem } from "@common/Core";
import { MissingEverythingCliFilePath } from "./MissingEverythingCliFilePath";

export const FileSearch = ({ contextBridge, goBack }: ExtensionProps) => {
    const { value: esFilePath, updateValue: setEsFilePath } = useExtensionSetting<string>({
        extensionId: "FileSearch",
        key: "everythingCliFilePath",
    });

    const getSearchResultItems = async (searchTerm: string) => {
        try {
            const searchResultItems = await contextBridge.invokeExtension<
                { searchTerm: string },
                Promise<SearchResultItem[]>
            >("FileSearch", { searchTerm });
            return searchResultItems;
        } catch (error) {
            console.log(`error: ${error}`);
            return [];
        }
    };

    if (contextBridge.getOperatingSystem() === "Windows" && !esFilePath) {
        return (
            <MissingEverythingCliFilePath contextBridge={contextBridge} goBack={goBack} setEsFilePath={setEsFilePath} />
        );
    }

    return <BasicSearch getSearchResultItems={getSearchResultItems} showGoBackButton />;
};
