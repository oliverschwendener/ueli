import type { SearchResultItem } from "@common/SearchResultItem";
import type { Searchable } from "@common/Searchable";

export class Application implements Searchable {
    public constructor(
        private readonly name: string,
        private readonly filePath: string,
        private readonly iconFilePath: string,
    ) {}

    public toSearchResultItem(): SearchResultItem {
        return {
            description: "Application",
            executionServiceArgument: this.filePath,
            executionServiceId: "FilePath",
            id: this.getId(),
            name: this.name,
            imageUrl: `file://${this.iconFilePath}`,
        };
    }

    private getId(): string {
        return Buffer.from(this.filePath).toString("base64");
    }
}
