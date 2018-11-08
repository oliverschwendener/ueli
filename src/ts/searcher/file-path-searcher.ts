import { existsSync, lstatSync } from "fs";
import { dirname, basename } from "path";
import { FileHelpers } from "../helpers/file-helpers";
import { SearchEngine } from "../search-engine";
import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";
import { FilePathDescriptionBuilder } from "../builders/file-path-description-builder";
import { IconSet } from "../icon-sets/icon-set";

export class FilePathSearcher implements Searcher {
    public readonly blockOthers = true;

    private readonly iconSet: IconSet;
    private readonly searchEngineThreshold: number;
    private readonly searchEngineLimit: number;

    constructor(searchEngineThreshold: number, searchEngineLimit: number, iconSet: IconSet) {
        this.searchEngineThreshold = searchEngineThreshold;
        this.searchEngineLimit = searchEngineLimit;
        this.iconSet = iconSet;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        let filePath;

        if (existsSync(userInput)) {
            filePath = userInput;
            const stats = lstatSync(filePath);
            if (stats.isDirectory()) {
                return this.getFolderSearchResult(filePath);
            } else {
                return this.getFileSearchResult(filePath);
            }
        } else if (existsSync(dirname(userInput))) {
            filePath = dirname(userInput);
            const searchTerm = basename(userInput);
            return this.getFolderSearchResult(filePath, searchTerm);
        }

        return [];
    }

    private getFolderSearchResult(folderPath: string, searchTerm?: string): SearchResultItem[] {
        const result = [] as SearchResultItem[];

        const filePaths = FileHelpers.getFilesFromFolder(folderPath);

        for (const filePath of filePaths) {
            const fileName = basename(filePath);

            result.push({
                description: FilePathDescriptionBuilder.buildFilePathDescription(filePath),
                executionArgument: filePath,
                icon: lstatSync(filePath).isDirectory()
                    ? this.iconSet.folderIcon
                    : this.iconSet.fileIcon,
                name: fileName,
                searchable: [fileName],
                tags: [],
            } as SearchResultItem);
        }

        return searchTerm === undefined
            ? result
            : this.sortSearchResult(result, searchTerm);
    }

    private sortSearchResult(searchResultItems: SearchResultItem[], searchTerm: string): SearchResultItem[] {
        const searchEngine = new SearchEngine(searchResultItems, this.searchEngineThreshold, this.searchEngineLimit);
        return searchEngine.search(searchTerm);
    }

    private getFileSearchResult(filePath: string): SearchResultItem[] {
        const fileName = basename(filePath);
        return [{
            description: FilePathDescriptionBuilder.buildFilePathDescription(filePath),
            executionArgument: filePath,
            icon: this.iconSet.fileIcon,
            name: fileName,
            searchable: [fileName],
        }];
    }
}
