import type { ExcludedSearchResultItem, SearchResultItem } from "@common/Core";

export class MacOsSystemSetting {
    public constructor(
        private readonly name: string,
        private readonly filePath: string,
        private readonly imageFilePath: string,
    ) {}

    public toSearchResultItem(): SearchResultItem {
        return {
            id: this.getId(),
            name: this.name,
            description: "System Setting",
            defaultAction: {
                argument: this.filePath,
                description: "Open System Setting",
                handlerId: "OpenFilePath",
                hideWindowAfterInvocation: true,
                fluentIcon: "OpenRegular",
            },
            additionalActions: [
                {
                    argument: JSON.stringify(<ExcludedSearchResultItem>{
                        id: this.getId(),
                        name: this.name,
                        imageUrl: `file://${this.imageFilePath}`,
                    }),
                    description: "Hide from search results",
                    descriptionTranslationKey: "searchResultItem.action.excludeFromSearchResults",
                    handlerId: "excludeFromSearchResults",
                    hideWindowAfterInvocation: false,
                    fluentIcon: "EyeOffRegular",
                },
            ],
            imageUrl: `file://${this.imageFilePath}`,
        };
    }

    private getId() {
        return `MacOsSystemSetting:${this.name}`;
    }
}
