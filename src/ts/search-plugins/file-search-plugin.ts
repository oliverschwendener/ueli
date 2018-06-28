import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { FileHelpers } from "../helpers/file-helpers";
import { IconSet } from "../icon-sets/icon-set";
import { Injector } from "../injector";
import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";
import { FileSearchOption } from "../file-search-option";

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
        const result = [];

        if (this.fileSearchOptions.length > 0) {
            for (const option of this.fileSearchOptions) {
                const files = option.recursive
                    ? FileHelpers.getFilesFromFolderRecursively(option.folderPath)
                    : FileHelpers.getFilesFromFolder(option.folderPath);

                for (const file of files) {
                    const stats = fs.lstatSync(file);

                    result.push({
                        executionArgument: file,
                        icon: stats.isDirectory()
                            ? this.iconSet.folderIcon
                            : this.iconSet.fileIcon,
                        name: path.basename(file),
                        tags: [],
                    });
                }
            }
        }

        return result;
    }
}
