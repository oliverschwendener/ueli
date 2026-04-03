import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import {
    createCopyToClipboardAction,
    createEmptyInstantSearchResult,
    type InstantSearchResultItems,
    type SearchResultItem,
} from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { QuickFormatterSettings as Settings } from "@common/Extensions/QuickFormatter";
import { QuickFormatter } from "./QuickFormatter";

export class QuickFormatterExtension implements Extension {
    public readonly id = "QuickFormatter";
    public readonly name = "Quick Formatter";

    public readonly defaultSettings: Settings = {
        command: "qf",
        enableStackTrace: true,
        enableJson: true,
        enableXml: true,
        enableDeepFormatting: true,
    };

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[QuickFormatter]",
    };

    public readonly author = {
        name: "Marco Senn-Haag",
        githubUserName: "MarcoSennHaag",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
    ) {}

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T extends keyof Settings>(key: T): Settings[T] {
        return this.defaultSettings[key];
    }

    private getSettingValue<T extends keyof Settings>(key: T): Settings[T] {
        return this.settingsManager.getValue(getExtensionSettingKey(this.id, key), this.getSettingDefaultValue(key));
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "quick-formatter.png")}`,
        };
    }

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        // The quick formatter does not have static search results
        return [];
    }

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        const command = this.getSettingValue("command");

        let formattedText;

        if (
            this.getSettingValue("enableStackTrace") &&
            searchTerm.toLowerCase().startsWith(command + "st ") &&
            searchTerm.length > command.length + 3
        ) {
            formattedText = this.formatText(searchTerm.substring(command.length + 2).trim(), "stacktrace");
        } else if (
            this.getSettingValue("enableJson") &&
            searchTerm.toLowerCase().startsWith(command + "j ") &&
            searchTerm.length > command.length + 2
        ) {
            formattedText = this.formatText(searchTerm.substring(command.length + 1).trim(), "json");
        } else if (
            this.getSettingValue("enableXml") &&
            searchTerm.toLowerCase().startsWith(command + "x ") &&
            searchTerm.length > command.length + 2
        ) {
            formattedText = this.formatText(searchTerm.substring(command.length + 1).trim(), "xml");
        } else if (searchTerm.toLowerCase().startsWith(command + " ") && searchTerm.length > command.length + 1) {
            formattedText = this.formatText(searchTerm.substring(command.length + 1).trim(), "auto");
        } else {
            return createEmptyInstantSearchResult();
        }

        return {
            after: [],
            before: [
                {
                    name: formattedText,
                    description: "Formatted text",
                    descriptionTranslation: {
                        key: "quickFormatterResult",
                        namespace: "extension[QuickFormatter]",
                    },
                    id: "quickFormatter:instantResult",
                    image: this.getImage(),
                    defaultAction: createCopyToClipboardAction({
                        textToCopy: formattedText,
                        description: "Copy formatted text to clipboard",
                        descriptionTranslation: {
                            key: "copyFormattedTextToClipboard",
                            namespace: "extension[QuickFormatter]",
                        },
                    }),
                },
            ],
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Quick Formatter",
                command: "Command to format text",
                enableStackTrace: "Enable StackTrace formatting",
                enableJson: "Enable JSON formatting",
                enableXml: "Enable XML formatting",
                enableDeepFormatting:
                    "Enable deep formatting of text (i.e. &lt; becomes <, JSON inside JSON values is also formatted)",
                generatorResult: "Formatted Text",
                copyFormattedTextToClipboard: "Copy formatted text to clipboard",
            },
            "de-CH": {
                extensionName: "Quick Formatter",
                command: "Eingabe, um Text zu formatieren",
                enableStackTrace: "Formatiere StackTraces",
                enableJson: "Formattiere JSON",
                enableXml: "Formattiere XML",
                enableDeepFormatting:
                    "Formattiere inneren Text (z.B. &lt; wird zu <, JSON innerhalb JSON Werten wird auch formattiert)",
                generatorResult: "Formatierter Text",
                copyFormattedTextToClipboard: "Formatierten Text in die Zwischenablage kopieren",
            },
        };
    }

    private formatText(text: string, mode: "auto" | "stacktrace" | "json" | "xml"): string {
        const enableDeepFormatting = this.getSettingValue("enableDeepFormatting");

        if (mode === "stacktrace") {
            return QuickFormatter.formatStackTrace(text, enableDeepFormatting);
        } else if (mode === "json") {
            return QuickFormatter.formatJson(text, enableDeepFormatting);
        } else if (mode === "xml") {
            return QuickFormatter.formatXml(text, enableDeepFormatting);
        } else {
            return QuickFormatter.formatAuto(text, enableDeepFormatting);
        }
    }
}
