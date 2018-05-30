import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { FileHelpers } from "../helpers/file-helpers";
import { IconManager } from "../icon-manager/icon-manager";
import { Injector } from "../injector";
import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";

export class FileSearchPlugin implements SearchPlugin {
    private folders: string[];
    private items: SearchResultItem[];
    private iconManager: IconManager;

    public constructor(folders: string[]) {
        this.folders = folders;
        this.iconManager = Injector.getIconManager(os.platform());
        this.items = this.loadFilesAndFolders();
    }

    public getAllItems(): SearchResultItem[] {
        return this.items;
    }

    private loadFilesAndFolders(): SearchResultItem[] {
        const result = [];

        if (this.folders.length > 0) {
            for (const folder of this.folders) {
                const files = FileHelpers.getFilesFromFolder(folder);

                for (const file of files) {
                    const stats = fs.lstatSync(file);

                    result.push({
                        executionArgument: file,
                        icon: stats.isDirectory()
                            ? this.iconManager.getFolderIcon()
                            : this.iconManager.getFileIcon(),
                        name: path.basename(file),
                        tags: [],
                    });
                }
            }
        }

        return result;
    }
}
