import * as fs from "fs";
import * as path from "path";
import { FileHelpers } from "../helpers/file-helpers";
import { Injector } from "../injector";
import { SearchEngine } from "../search-engine";
import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";
import { platform } from "os";
import { UserConfigOptions } from "../user-config/user-config-options";
import { FilePathDescriptionBuilder } from "../builders/file-path-description-builder";

export class FilePathSearcher implements Searcher {
    private iconSet = Injector.getIconSet(platform());
    private config: UserConfigOptions;

    constructor(config: UserConfigOptions) {
        this.config = config;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        let filePath;

        if (fs.existsSync(userInput)) {
            filePath = userInput;
            const stats = fs.lstatSync(filePath);
            if (stats.isDirectory()) {
                return this.getFolderSearchResult(filePath);
            } else {
                return this.getFileSearchResult(filePath);
            }
        } else if (fs.existsSync(path.dirname(userInput))) {
            filePath = path.dirname(userInput);
            const searchTerm = path.basename(userInput);
            return this.getFolderSearchResult(filePath, searchTerm);
        }

        return [];
    }

    private getFolderSearchResult(folderPath: string, searchTerm?: string): SearchResultItem[] {
        const result = [] as SearchResultItem[];

        const filePaths = FileHelpers.getFilesFromFolder(folderPath);

        for (const filePath of filePaths) {
            const fileName = path.basename(filePath);

            result.push({
                description: FilePathDescriptionBuilder.buildFilePathDescription(filePath),
                executionArgument: filePath,
                icon: fs.lstatSync(filePath).isDirectory()
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
        const searchEngine = new SearchEngine(searchResultItems, this.config.searchEngineThreshold);
        return searchEngine.search(searchTerm);
    }

    private getFileSearchResult(filePath: string): SearchResultItem[] {
        const fileName = path.basename(filePath);

        return [
            {
                description: FilePathDescriptionBuilder.buildFilePathDescription(filePath),
                executionArgument: filePath,
                icon: this.iconSet.fileIcon,
                name: fileName,
                searchable: [fileName],
                tags: [],
            } as SearchResultItem,
        ];
    }
}
