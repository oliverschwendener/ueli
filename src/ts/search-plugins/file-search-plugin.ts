import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { FileHelpers } from "../helpers/file-helpers";
import { IconSet } from "../icon-sets/icon-set";
import { Injector } from "../injector";
import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";
import { FileSearchOption } from "../file-search-option";
import { FilePathDescriptionBuilder } from "../builders/file-path-description-builder";

export class FileSearchPlugin implements SearchPlugin {
    private fileSearchOptions: FileSearchOption[];
    private items: SearchResultItem[];
    private iconSet: IconSet;

    public constructor(fileSearchOptions: FileSearchOption[]) {
        this.fileSearchOptions = fileSearchOptions;
        this.iconSet = Injector.getIconSet(os.platform());
        this.items = this.loadFilesAndFolders();
    }

    public getAllItems(): SearchResultItem[] {
        return this.items;
    }

    private loadFilesAndFolders(): SearchResultItem[] {
        const result = [] as SearchResultItem[];

        if (this.fileSearchOptions.length > 0) {
            for (const option of this.fileSearchOptions) {
                const filePaths = option.recursive
                    ? FileHelpers.getFilesFromFolderRecursively(option.folderPath)
                    : FileHelpers.getFilesFromFolder(option.folderPath);

                for (const filePath of filePaths) {
                    const stats = fs.lstatSync(filePath);
                    const fileName = path.basename(filePath);

                    result.push({
                        description: FilePathDescriptionBuilder.buildFilePathDescription(filePath),
                        executionArgument: filePath,
                        icon: stats.isDirectory()
                            ? this.iconSet.folderIcon
                            : this.iconSet.fileIcon,
                        name: fileName,
                        searchable: [fileName],
                        tags: [],
                    });
                }
            }
        }

        return result;
    }
}
