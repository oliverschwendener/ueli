import * as os from "os";
import * as path from "path";
import { SearchPlugin } from "./search-plugin";
import { SearchResultItem } from "../search-engine";
import { FileHelpers } from "../helpers/file-helpers";

export class HomeFolderSearchPlugin implements SearchPlugin {
    private homeFolderPath = os.homedir();
    private filesAndFolders: SearchResultItem[];

    constructor() {
        this.filesAndFolders = this.getFilesAndFolders();
    }

    public getAllItems(): SearchResultItem[] {
        return this.filesAndFolders;
    }

    private getFilesAndFolders(): SearchResultItem[] {
        let result = [] as SearchResultItem[];

        let files = FileHelpers.getFilesFromFolder(this.homeFolderPath);

        files.map((f) => {
            result.push(<SearchResultItem>{
                name: path.basename(f),
                executionArgument: f,
                tags: []
            });
        });

        return result;
    }
}