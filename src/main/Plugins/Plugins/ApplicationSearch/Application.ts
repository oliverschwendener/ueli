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
            descriptionTranslationKey: "plugin[ApplicationSearch].searchResultItemDescription",
            id: this.getId(),
            name: this.name,
            imageUrl: `file://${this.iconFilePath}`,
            defaultAction: {
                argument: this.filePath,
                description: "",
                descriptionTranslationKey: "",
                handlerId: "FilePath",
                hideWindowAfterInvokation: true,
            },
        };
    }

    private getId(): string {
        return Buffer.from(this.filePath).toString("base64");
    }
}
