import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";

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
            defaultAction: SearchResultItemActionUtility.createOpenFileAction({
                filePath: this.filePath,
                description: "Open System Setting",
            }),
            imageUrl: this.getImageUrl(),
        };
    }

    private getId() {
        return `MacOsSystemSetting:${this.name}`;
    }

    private getImageUrl(): string {
        return `file://${this.imageFilePath}`;
    }
}
