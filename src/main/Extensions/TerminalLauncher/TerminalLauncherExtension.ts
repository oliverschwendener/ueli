import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { ActionArgument } from "./ActionArgument";
import type { Settings } from "./Settings";

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

    private readonly terminalImageFileNames = {
        Terminal: "terminal.png",
        iTerm: "iterm.png",
        "Command Prompt": "command-prompt.png",
        Powershell: "powershell.png",
        "Powershell Core": "powershell-core.svg",
        WSL: "wsl.png",
    };

    private readonly defaultSettings: Record<OperatingSystem, Settings> = {
        macOS: { terminalIds: ["Terminal"] },
        Windows: { terminalIds: ["Command Prompt"] },
        Linux: { terminalIds: [] },
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
        return ["macOS", "Windows"].includes(this.operatingSystem);
    }

    public getSettingDefaultValue<T>(key: string) {
        return this.defaultSettings[this.operatingSystem][key] as T;
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "windows-terminal.png")}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Terminal Launcher",
                terminals: "Terminals",
                defaultActionDescription: "Launch command in {{terminalId}}",
                searchResultItemDescription: "Launch in {{terminalId}}",
            },
            "de-CH": {
                extensionName: "Terminal Launcher",
                terminals: "Terminals",
                defaultActionDescription: "Befehl in {{terminalId}} ausführen",
                searchResultItemDescription: "In {{terminalId}} öffnen",
            },
        };
    }

    public getInstantSearchResultItems(searchTerm: string): SearchResultItem[] {
        if (!searchTerm.startsWith(">") || searchTerm.length < 2) {
            return [];
        }

        const command = searchTerm.replace(">", "").trim();

        const { t } = this.translator.createT(this.getI18nResources());

        return this.getEnabledTerminalIds().map((terminalId) => ({
            defaultAction: {
                argument: JSON.stringify(<ActionArgument>{ command, terminalId }),
                description: t("defaultActionDescription", { terminalId }),
                handlerId: "LaunchTerminalActionHandler",
                fluentIcon: "WindowConsoleRegular",
            },
            description: t("searchResultItemDescription", { terminalId }),
            id: "[TerminalLauncher][instantSearchResultItem]",
            image: this.getTerminalImage(terminalId),
            name: `$ ${command}`,
        }));
    }

    public getAssetFilePath(terminalId: string): string {
        return this.assetPathResolver.getExtensionAssetPath(this.id, this.terminalImageFileNames[terminalId]);
    }

    private getEnabledTerminalIds(): string[] {
        return this.settingsManager
            .getValue<string[]>("extension[TerminalLauncher].terminalIds", this.getSettingDefaultValue("terminalIds"))
            .filter((terminalId) => this.getSupportedTerminalIds().includes(terminalId));
    }

    private getTerminalImage(terminalId: string): Image {
        return {
            url: `file://${this.getAssetFilePath(terminalId)}`,
        };
    }

    private getSupportedTerminalIds(): string[] {
        return Object.keys(this.terminalImageFileNames);
    }
}
