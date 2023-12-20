import type { OperatingSystem } from "@common/OperatingSystem";
import type { SearchResultItem } from "@common/SearchResultItem";
import type { DependencyInjector } from "../../DependencyInjector";
import type { Extension } from "../../Extension";

export class SystemColorThemeSwitcher implements Extension {
    public readonly id: string = "SystemColorThemeSwitcher";
    public readonly name: string = "SystemColorThemeSwitcher";
    public readonly nameTranslationKey: string = "extension[SystemColorThemeSwitcher].extensionName";
    public readonly supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];

    public constructor(private readonly currentOperatingSystem: OperatingSystem) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [
            {
                description: "System",
                id: "SystemColorThemeSwitcher:toggle",
                name: "Toggle System Appearance",
                nameTranslationKey: "",
                imageUrl: this.getSearchResultItemImageUrl(),
                defaultAction: {
                    argument: "toggle",
                    description: "",
                    descriptionTranslationKey: "",
                    handlerId: "SystemColorThemeSwitcher",
                    hideWindowAfterInvokation: false,
                },
            },
        ];
    }

    public isSupported(dependencyInjector: DependencyInjector): boolean {
        const currentOperatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];
        return supportedOperatingSystems.includes(currentOperatingSystem);
    }

    private getSearchResultItemImageUrl(): string {
        return {
            macOS: "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/System_Preferences_icon.png/120px-System_Preferences_icon.png",
            Windows:
                "https://preview.redd.it/windows-11-logo-in-svg-format-v0-sudz5o3s1vn91.png?width=1080&format=png&auto=webp&s=196ef4f2bff864c6d3f58b074fa32479a285ab49",
        }[this.currentOperatingSystem];
    }
}
