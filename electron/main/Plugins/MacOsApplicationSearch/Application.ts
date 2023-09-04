import type { SearchResultItem } from "@common/SearchResultItem";
import type { Searchable } from "@common/Searchable";
import { parse } from "path";

export class Application implements Searchable {
    public static fromFilePathAndOptionalIcon({
        filePath,
        iconFilePath,
    }: {
        filePath: string;
        iconFilePath?: string;
    }): Application {
        return new Application(filePath, iconFilePath);
    }

    private constructor(
        private readonly filePath: string,
        private readonly iconFilePath?: string,
    ) {}

    public toSearchResultItem(): SearchResultItem {
        return {
            id: this.getId(),
            description: "Application",
            name: this.getApplicationName(),
            imageUrl: this.iconFilePath ? `file://${this.iconFilePath}` : undefined,
            executionServiceId: "FilePath",
            executionServiceArgument: this.filePath,
        };
    }

    private getId(): string {
        return Buffer.from(this.filePath).toString("base64");
    }

    private getApplicationName(): string {
        return parse(this.filePath).name;
    }
}
