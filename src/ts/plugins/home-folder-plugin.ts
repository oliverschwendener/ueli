import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { SearchPlugin } from "./search-plugin";
import { SearchResultItem } from "../search-engine";
import { FileHelpers } from "../helpers/file-helpers";
import { Injector } from "../injector";
import { IconManager } from "../icon-manager";

export class HomeFolderSearchPlugin implements SearchPlugin {
    private homeFolderPath = os.homedir();
    private filesAndFolders: SearchResultItem[];
    private iconManager: IconManager;

    constructor() {
        this.iconManager = Injector.getIconManager();
        this.filesAndFolders = this.getFilesAndFolders();
    }

    public getAllItems(): SearchResultItem[] {
        return this.filesAndFolders;
    }

    private getFilesAndFolders(): SearchResultItem[] {
        let result = [] as SearchResultItem[];

        let files = FileHelpers.getFilesFromFolder(this.homeFolderPath);

        files.map((f) => {
            let stats = fs.lstatSync(f);

            result.push(<SearchResultItem>{
                name: path.basename(f),
                executionArgument: f,
                tags: [],
                icon: stats.isDirectory()
                    ? this.iconManager.getFolderIcon()
                    : this.iconManager.getFileIcon()
            });
        });

        return result;
    }
}