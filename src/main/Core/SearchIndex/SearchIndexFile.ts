import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { App } from "electron";
import { join } from "path";
import type { SearchIndexFile as SearchIndexFileInterface } from "./Contract/SearchIndexFile";
import type { Index } from "./Contract/SearchIndexStructure";

export class SearchIndexFile implements SearchIndexFileInterface {
    public constructor(
        private readonly app: App,
        private readonly fileSystemUtility: FileSystemUtility,
    ) {}

    public getPath(): string {
        return join(this.app.getPath("userData"), "searchIndex.json");
    }

    public exists(): boolean {
        return this.fileSystemUtility.existsSync(this.getPath());
    }

    public read(): Index {
        return this.fileSystemUtility.existsSync(this.getPath())
            ? this.fileSystemUtility.readJsonFileSync<Index>(this.getPath())
            : {};
    }

    public write(index: Index): void {
        this.fileSystemUtility.writeJsonFileSync(index, this.getPath());
    }
}
