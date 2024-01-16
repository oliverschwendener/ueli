import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { DependencyInjector } from "@Core/DependencyInjector";
import type { Extension } from "@Core/Extension";
import type { ExtensionAssetPathResolver } from "@Core/ExtensionAssets";

export class SystemColorThemeSwitcher implements Extension {
    public readonly id: string = "SystemColorThemeSwitcher";
    public readonly name: string = "SystemColorThemeSwitcher";
    public readonly nameTranslationKey: string = "extension[SystemColorThemeSwitcher].extensionName";
    public readonly supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];

    public constructor(
        private readonly currentOperatingSystem: OperatingSystem,
        private readonly extensionAssetPathResolver: ExtensionAssetPathResolver,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [
            {
                description: "System",
                id: "SystemColorThemeSwitcher:toggle",
                name: "Toggle System Appearance",
                nameTranslationKey: "",
                imageUrl: `file://${this.extensionAssetPathResolver.getAssetFilePath(
                    this.id,
                    this.getSearchResultItemFileName(),
                )}`,
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

    public getSettingDefaultValue<T>(): T {
        return undefined as T;
    }

    public isSupported(dependencyInjector: DependencyInjector): boolean {
        const currentOperatingSystem = dependencyInjector.getInstance<OperatingSystem>("OperatingSystem");
        const supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];
        return supportedOperatingSystems.includes(currentOperatingSystem);
    }

    private getSearchResultItemFileName(): string {
        return {
            macOS: "macos-system-settings-icon.png",
            Windows: "windows-11-logo.webp",
        }[this.currentOperatingSystem];
    }
}
