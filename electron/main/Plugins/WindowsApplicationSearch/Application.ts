import type { SearchResultItem } from "@common/SearchResultItem";
import type { Searchable } from "@common/Searchable";
import type { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";

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
            id: this.getId(),
            name: this.name,
            imageUrl: `file:///${this.iconFilePath}`,
            executorId: "FilePath",
            executorArgument: this.filePath,
        };
    }

    private getId(): string {
        return Buffer.from(this.filePath).toString("base64");
    }
}
