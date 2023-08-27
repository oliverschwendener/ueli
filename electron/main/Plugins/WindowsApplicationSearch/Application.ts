import { SearchResultItem, Searchable } from "@common/SearchResultItem";
import { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";

export class Application implements Searchable {
    public static fromFilePath({ BaseName, FullName, IconFilePath }: WindowsApplicationRetrieverResult) {
        return new Application(BaseName, FullName, IconFilePath);
    }

    private constructor(
        private readonly name: string,
        private readonly filePath: string,
        private readonly iconFilePath: string,
    ) {}

    public toSearchResultItem(): SearchResultItem {
        return {
            description: "Application",
            id: this.filePath,
            name: this.name,
            imageUrl: `file:///${this.iconFilePath}`,
        };
    }
}
