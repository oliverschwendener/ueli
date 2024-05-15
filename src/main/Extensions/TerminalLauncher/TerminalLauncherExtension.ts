import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { Translations } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { ActionArgument } from "./ActionArgument";

export class TerminalLauncherExtension implements Extension {
    public readonly id = "TerminalLauncher";

    public readonly name: string;

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[TerminalLauncher]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
    ) {}

    async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [];
    }

    public isSupported(): boolean {
        return this.operatingSystem === "macOS";
    }

    public getSettingDefaultValue<T>(key: string): T {
        const defaultSettings = {
            terminalIds: ["Terminal"],
        };

        return defaultSettings[key];
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "windows-terminal.png")}`,
        };
    }

    public getTranslations(): Translations {
        return {
            "en-US": {
                extensionName: "Terminal Launcher",
                terminal: "Terminal",
                defaultActionDescription: "Launch command in {{terminal}}",
                searchResultItemDescription: "Launch in Terminal",
                searchResultItemName: `Run "{{command}}" in {{terminalId}}`,
            },
            "de-CH": {
                extensionName: "Terminal Launcher",
                terminal: "Terminal",
                defaultActionDescription: "Befehl in {{terminal}} ausführen",
                searchResultItemDescription: "Im Terminal öffnen",
                searchResultItemName: `"{{command}}" mit {{terminalId}} ausführen`,
            },
        };
    }

    public getInstantSearchResultItems(searchTerm: string): SearchResultItem[] {
        if (!searchTerm.startsWith(">") || searchTerm.length < 2) {
            return [];
        }

        const command = searchTerm.replace(">", "").trim();

        const { t } = this.translator.createInstance(this.getTranslations());

        return this.getEnabledTerminalIds().map((terminalId) => ({
            defaultAction: {
                argument: JSON.stringify(<ActionArgument>{ command, terminalId }),
                description: t("defaultActionDescription", { terminal: terminalId }),
                handlerId: "LaunchTerminalActionHandler",
                fluentIcon: "WindowConsoleRegular",
            },
            description: t("searchResultItemDescription", { terminal: terminalId }),
            id: "[TerminalLauncher][instantSearchResultItem]",
            image: this.getImage(),
            name: t("searchResultItemName", { command, terminalId }),
        }));
    }

    private getEnabledTerminalIds(): string[] {
        return this.settingsManager.getValue<string[]>(
            "extension[TerminalLauncher].terminalIds",
            this.getSettingDefaultValue("terminalIds"),
        );
    }
}
