import { lstatSync } from "fs";
import { basename } from "path";
import { FileHelpers } from "../helpers/file-helpers";
import { IconSet } from "../icon-sets/icon-set";
import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";
import { FileSearchOption } from "../file-search-option";
import { FilePathDescriptionBuilder } from "../builders/file-path-description-builder";

export class FileSearchPlugin implements SearchPlugin {
    private fileSearchOptions: FileSearchOption[];
    private items: SearchResultItem[];
    private iconSet: IconSet;
    private blackList: string[];

    public constructor(fileSearchOptions: FileSearchOption[], iconSet: IconSet, blackList: string[]) {
        this.fileSearchOptions = fileSearchOptions;
        this.iconSet = iconSet;
        this.blackList = blackList;
        this.items = this.loadFilesAndFolders();
    }

    public getIndexLength(): number {
        return this.items.length;
    }

    public getAllItems(): SearchResultItem[] {
        return this.items;
    }

    private loadFilesAndFolders(): SearchResultItem[] {
        const result = [] as SearchResultItem[];

        if (this.fileSearchOptions.length > 0) {
            for (const option of this.fileSearchOptions) {
                const filePaths = option.recursive
                    ? FileHelpers.getFilesFromFolderRecursively(option.folderPath, this.blackList)
                    : FileHelpers.getFilesFromFolder(option.folderPath);

                for (const filePath of filePaths) {
                    const stats = lstatSync(filePath);
                    const fileName = basename(filePath);

                    result.push({
                        description: FilePathDescriptionBuilder.buildFilePathDescription(filePath),
                        executionArgument: filePath,
                        icon: stats.isDirectory()
                            ? this.iconSet.folderIcon
                            : this.iconSet.fileIcon,
                        name: fileName,
                        searchable: [fileName],
                    });
                }
            }
        }

        return result;
    }
}
