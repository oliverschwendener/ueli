import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Shortcut } from "@common/Extensions/Shortcuts";

export class Shortcuts implements Extension {
    private static readonly translationNamespace = "extension[Shortcuts]";

    public readonly id = "Shortcuts";
    public readonly name = "Shortcuts";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: Shortcuts.translationNamespace,
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    private defaultSettings: { shortcuts: Shortcut[] } = {
        shortcuts: [],
    };

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly settingsManager: SettingsManager,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const shortcuts = this.settingsManager.getValue<Shortcut[]>(
            getExtensionSettingKey(this.id, "shortcuts"),
            this.defaultSettings.shortcuts,
        );

        return shortcuts.map(
            ({ name, id, type, argument, hideWindowAfterInvokation }): SearchResultItem => ({
                name: name,
                description: "Shortcut",
                descriptionTranslation: {
                    key: "shortcut",
                    namespace: Shortcuts.translationNamespace,
                },
                id: `shorcut-${id}`,
                imageUrl: this.getImageUrl(),
                defaultAction: {
                    argument: JSON.stringify({ type, argument }),
                    description: "Invoke shortcut",
                    descriptionTranslation: {
                        key: "invokeShortcut",
                        namespace: Shortcuts.translationNamespace,
                    },
                    handlerId: "Shortcut",
                    hideWindowAfterInvocation: hideWindowAfterInvokation,
                    fluentIcon: "ArrowSquareUpRightRegular",
                },
            }),
        );
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.defaultSettings[key];
    }

    public getImageUrl(): string {
        return `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "bolt.square.svg")}`;
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [getExtensionSettingKey(this.id, "shortcuts")];
    }
}
