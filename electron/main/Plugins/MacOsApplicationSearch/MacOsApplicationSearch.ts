import { normalize } from "path";
import { SearchIndex } from "../../SearchIndex";
import { CommandlineUtility, FileIconUtility } from "../../Utilities";
import { Plugin } from "../Plugin";
import { Application } from "./Application";

export class MacOsApplicationSearch implements Plugin {
    private static readonly applicationFolders = ["/System/Applications/", "/Applications/"];

    public constructor(private readonly searchIndex: SearchIndex) {}

    public async addSearchResultItemsToSearchIndex(): Promise<void> {
        const filePaths = await this.getAllFilePaths();
        const icons = await this.getAllIcons(filePaths);

        const searchResultItems = filePaths
            .map((filePath) => Application.fromFilePathAndIcon({ filePath, iconDataUrl: icons[filePath] }))
            .map((application) => application.toSearchResultItem());

        this.searchIndex.addSearchResultItems("MacOsApplicationSearch", searchResultItems);
    }

    private async getAllFilePaths(): Promise<string[]> {
        return (await CommandlineUtility.executeCommandWithOutput(`mdfind "kMDItemKind == 'Application'"`))
            .split("\n")
            .map((filePath) => normalize(filePath).trim())
            .filter((filePath) =>
                MacOsApplicationSearch.applicationFolders.some((applicationFolder) =>
                    filePath.startsWith(applicationFolder),
                ),
            )
            .filter((filePath) => [".", ".."].indexOf(filePath) === -1);
    }

    private async getAllIcons(filePaths: string[]): Promise<Record<string, string>> {
        const result: Record<string, string> = {};

        const promiseResults = await Promise.allSettled(
            filePaths.map((filePath) => FileIconUtility.getIconDataUrlFromFilePath(filePath)),
        );

        for (const promiseResult of promiseResults) {
            if (promiseResult.status === "fulfilled") {
                result[promiseResult.value.filePath] = promiseResult.value.dataUrl;
            }
        }

        return result;
    }
}
