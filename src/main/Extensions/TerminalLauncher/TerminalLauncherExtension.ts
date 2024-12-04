import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { TerminalRegistry } from "@Core/Terminal";
import type { Translator } from "@Core/Translator";
import {
    createEmptyInstantSearchResult,
    type InstantSearchResultItems,
    type OperatingSystem,
    type SearchResultItem,
} from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { ActionArgument } from "./ActionArgument";
import type { Settings } from "./Settings";

export class TerminalLauncherExtension implements Extension {
    public readonly id = "TerminalLauncher";

    public readonly name = "Terminal Launcher";

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
        private readonly terminalRegistry: TerminalRegistry,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [];
    }

    public isSupported(): boolean {
        return ["macOS", "Windows"].includes(this.operatingSystem);
    }

    public getSettingDefaultValue(key: keyof Settings) {
        const defaultSettings: Settings = {
            prefix: ">",
            terminalIds: this.terminalRegistry
                .getAll()
                .filter((terminal) => terminal.isEnabledByDefault)
                .map((terminal) => terminal.terminalId),
        };

        return defaultSettings[key];
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getModuleAssetPath("Terminal", "windows-terminal.png")}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Terminal Launcher",
                prefix: "Prefix",
                prefixDescription:
                    "The prefix to trigger the terminal launcher. Launch the terminal with this pattern: <prefix> <command>",
                terminals: "Terminals",
                selectTerminals: "Select terminals",
                defaultActionDescription: "Launch command in {{terminalId}}",
                searchResultItemDescription: "Launch in {{terminalId}}",
            },
            "de-CH": {
                extensionName: "Terminal Launcher",
                prefix: "Präfix",
                prefixDescription:
                    "Das Präfix, um den Terminal Launcher zu starten. Starten Sie den Terminal mit diesem Muster: <präfix> <befehl>",
                terminals: "Terminals",
                selectTerminals: "Terminal auswählen",
                defaultActionDescription: "Befehl in {{terminalId}} ausführen",
                searchResultItemDescription: "In {{terminalId}} öffnen",
            },
        };
    }

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        if (!searchTerm.startsWith(this.getPrefix()) || searchTerm.replace(this.getPrefix(), "").trim().length === 0) {
            return createEmptyInstantSearchResult();
        }

        const { t } = this.translator.createT(this.getI18nResources());

        const command = this.extractCommandFromSearchTerm(searchTerm);

        return {
            after: this.getEnabledTerminalIds().map((terminalId) => ({
                defaultAction: {
                    argument: JSON.stringify(<ActionArgument>{ command, terminalId }),
                    description: t("defaultActionDescription", { terminalId }),
                    handlerId: "LaunchTerminalActionHandler",
                    fluentIcon: "WindowConsoleRegular",
                    hideWindowAfterInvocation: true,
                },
                description: t("searchResultItemDescription", { terminalId }),
                id: `[${this.id}][instantSearchResultItem][${terminalId}]`,
                image: this.getTerminalImage(terminalId),
                name: command,
            })),
            before: [],
        };
    }

    private getPrefix(): string {
        return this.settingsManager.getValue<string>(
            `extension[${this.id}].prefix`,
            <string>this.getSettingDefaultValue("prefix"),
        );
    }

    private extractCommandFromSearchTerm(searchTerm: string): string {
        return searchTerm.replace(this.getPrefix(), "").trim();
    }

    public getAssetFilePath(terminalId: string): string {
        return this.assetPathResolver.getModuleAssetPath(
            "Terminal",
            this.terminalRegistry.getById(terminalId).getAssetFileName(),
        );
    }

    private getEnabledTerminalIds(): string[] {
        return this.settingsManager
            .getValue<
                string[]
            >(`extension[${this.id}].terminalIds`, <string[]>this.getSettingDefaultValue("terminalIds"))
            .filter((terminalId) =>
                this.terminalRegistry
                    .getAll()
                    .map((terminal) => terminal.terminalId)
                    .includes(terminalId),
            );
    }

    private getTerminalImage(terminalId: string): Image {
        return {
            url: `file://${this.getAssetFilePath(terminalId)}`,
        };
    }
}
