import * as fs from "fs";
import * as path from "path";
import { Searcher } from "./searcher";
import { SearchResultItem, SearchEngine } from "../search-engine";
import { FileHelpers } from "../helpers/file-helpers";
import { Injector } from "../injector";

export class FilePathSearcher implements Searcher {
    private iconManager = Injector.getIconManager();

    public getSearchResult(userInput: string): SearchResultItem[] {
        let filePath;

        if (fs.existsSync(userInput)) {
            filePath = userInput;
            let stats = fs.lstatSync(filePath);
            if (stats.isDirectory()) {
                return this.getFolderSearchResult(filePath);
            }
            else {
                return this.getFileSearchResult(filePath);
            }
        }
        else if (fs.existsSync(path.dirname(userInput))) {
            filePath = path.dirname(userInput);
            let searchTerm = path.basename(userInput);
            return this.getFolderSearchResult(filePath, searchTerm);
        }

        return [];
    }

    private getFolderSearchResult(folderPath: string, searchTerm?: string): SearchResultItem[] {
        let result = [] as SearchResultItem[];

        let files = FileHelpers.getFilesFromFolder(folderPath);

        for (let file of files) {
            result.push(<SearchResultItem>{
                name: path.basename(file),
                executionArgument: file,
                icon: fs.lstatSync(file).isDirectory()
                    ? this.iconManager.getFolderIcon()
                    : this.iconManager.getFileIcon(),
                tags: []
            });
        }

        return searchTerm === undefined
            ? result
            : this.sortSearchResult(result, searchTerm);
    }

    private sortSearchResult(searchResultItems: SearchResultItem[], searchTerm: string): SearchResultItem[] {
        let searchEngine = new SearchEngine(searchResultItems);
        return searchEngine.search(searchTerm);
    }

    private getFileSearchResult(filePath: string): SearchResultItem[] {
        return [
            <SearchResultItem>{
                name: path.basename(filePath),
                executionArgument: filePath,
                icon: this.iconManager.getFileIcon(),
                tags: []
            }
        ];
    }
}