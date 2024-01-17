import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import { resources } from "./resources";

export class SystemColorThemeSwitcher implements Extension {
    public readonly id: string = "SystemColorThemeSwitcher";
    public readonly name: string = "SystemColorThemeSwitcher";
    public readonly nameTranslationKey: string = "extension[SystemColorThemeSwitcher].extensionName";
    public readonly supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];
    public readonly settingKeysTriggerindReindex = ["general.language"];

    public constructor(
        private readonly currentOperatingSystem: OperatingSystem,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly translator: Translator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const t = await this.translator.createInstance(resources);

        return [
            {
                description: t("searchResultItem.description"),
                id: "SystemColorThemeSwitcher:toggle",
                name: t("searchResultItem.name"),
                imageUrl: `file://${this.assetPathResolver.getExtensionAssetPath(
                    this.id,
                    this.getSearchResultItemFileName(),
                )}`,
                defaultAction: {
                    argument: "toggle",
                    description: t("searchResultItem.actionDescription"),
                    handlerId: "SystemColorThemeSwitcher",
                    hideWindowAfterInvokation: false,
                },
            },
        ];
    }

    public getSettingDefaultValue<T>(): T {
        return undefined as T;
    }

    public isSupported(dependencyRegistry: DependencyRegistry): boolean {
        const currentOperatingSystem = dependencyRegistry.get("OperatingSystem");
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
