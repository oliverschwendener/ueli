import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { FileHelpers } from "../helpers/file-helpers";
import { IconManager } from "../icon-manager/icon-manager";
import { Injector } from "../injector";
import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";

export class HomeFolderSearchPlugin implements SearchPlugin {
    private homeFolderPath = os.homedir();
    private filesAndFolders: SearchResultItem[];
    private iconManager: IconManager;

    public constructor() {
        this.iconManager = Injector.getIconManager();
        this.filesAndFolders = this.getFilesAndFolders();
    }

    public getAllItems(): SearchResultItem[] {
        return this.filesAndFolders;
    }

    private getFilesAndFolders(): SearchResultItem[] {

        const files = FileHelpers.getFilesFromFolder(this.homeFolderPath);

        const result = files.map((f): SearchResultItem => {
            const stats = fs.lstatSync(f);

            return {
                executionArgument: f,
                icon: stats.isDirectory()
                    ? this.iconManager.getFolderIcon()
                    : this.iconManager.getFileIcon(),
                name: path.basename(f),
                tags: [],
            } as SearchResultItem;
        });

        return result;
    }
}
