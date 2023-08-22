import { SearchResultItem, Searchable } from "@common/SearchResultItem";
import { parse } from "path";

export class Application implements Searchable {
    public static fromFilePathAndIcon({
        filePath,
        iconDataUrl,
    }: {
        filePath: string;
        iconDataUrl: string;
    }): Application {
        return new Application(filePath, iconDataUrl);
    }

    private constructor(
        private readonly filePath: string,
        private readonly iconDataUrl: string,
    ) {}

    public toSearchResultItem(): SearchResultItem {
        return {
            id: this.getId(),
            description: "Application",
            name: this.getApplicationName(),
            icon: this.iconDataUrl,
        };
    }

    private getId(): string {
        return Buffer.from(this.filePath).toString("base64");
    }

    private getApplicationName(): string {
        return parse(this.filePath).name;
    }
}
