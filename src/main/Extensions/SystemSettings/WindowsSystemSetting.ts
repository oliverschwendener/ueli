import { type SearchResultItem } from "@common/Core";
import type { SystemSetting } from "./SystemSetting";

export class WindowsSystemSetting implements SystemSetting {
    public constructor(
        private readonly name: string,
        private readonly settingsUrl: string,
        private readonly imageFilePath: string,
    ) {}

    public toSearchResultItem(): SearchResultItem {
        return {
            defaultAction: {
                argument: this.settingsUrl,
                description: "Open System Settings",
                handlerId: "WindowsSystemSetting",
                hideWindowAfterInvocation: true,
                fluentIcon: "OpenRegular",
            },
            description: "System Setting",
            details: this.settingsUrl,
            id: this.getId(),
            image: {
                url: `file://${this.imageFilePath}`,
            },
            name: this.name,
        };
    }

    private getId(): string {
        return `WindowsSystemSetting:${this.name}[${this.settingsUrl}]`;
    }
}
