import { createOpenFileAction, type SearchResultItem } from "@common/Core";
import type { SystemSetting } from "./SystemSetting";

export class MacOsSystemSetting implements SystemSetting {
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
            defaultAction: createOpenFileAction({
                filePath: this.filePath,
                description: "Open System Setting",
            }),
            details: this.filePath,
            image: { url: this.getImageUrl() },
        };
    }

    private getId() {
        return `MacOsSystemSetting:${this.name}`;
    }

    private getImageUrl(): string {
        return `file://${this.imageFilePath}`;
    }
}
