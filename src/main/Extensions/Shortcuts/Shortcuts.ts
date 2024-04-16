import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { FileImageGenerator, UrlImageGenerator } from "@Core/ImageGenerator";
import { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import type { SearchResultItem } from "@common/Core";
import { getExtensionSettingKey, type Translations } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Shortcut, ShortcutType } from "@common/Extensions/Shortcuts";

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
        private readonly settingsManager: SettingsManager,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly urlImageGenerator: UrlImageGenerator,
        private readonly fileImageGenerator: FileImageGenerator,
        private readonly logger: Logger,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const shortcuts = this.settingsManager.getValue<Shortcut[]>(
            getExtensionSettingKey(this.id, "shortcuts"),
            this.defaultSettings.shortcuts,
        );

        const images = await this.getSearchResultItemImages(shortcuts);

        return shortcuts.map(
            ({ name, id, type, argument }): SearchResultItem => ({
                name: name,
                description: "Shortcut",
                descriptionTranslation: {
                    key: "shortcut",
                    namespace: Shortcuts.translationNamespace,
                },
                id,
                image: Object.keys(images).includes(id) ? images[id] : this.getImage(),
                defaultAction: {
                    argument: JSON.stringify({ type, argument }),
                    description: "Invoke shortcut",
                    descriptionTranslation: {
                        key: "invokeShortcut",
                        namespace: Shortcuts.translationNamespace,
                    },
                    handlerId: "Shortcut",
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

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "bolt.square.svg")}`,
        };
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [getExtensionSettingKey(this.id, "shortcuts")];
    }

    public getTranslations(): Translations {
        return {
            "en-US": {
                extensionName: "Shortcuts",
                shortcut: "Shortcut",
                shortcuts: "Shortcuts",
                invokeShortcut: "Invoke shortcut",
                type: "Type",
                typeFile: "File",
                typeUrl: "URL",
                typeCommand: "Command",
                filePath: "File Path",
                fileOrFolderDoesNotExist: "File/folder does not exist",
                name: "Name",
                invalidName: "Invalid name",
                createShortcut: "Create Shortcut",
                editShortcut: "Edit Shortcut",
                save: "Save",
                cancel: "Cancel",
                edit: "Edit",
                remove: "Remove",
                chooseFile: "Choose file or folder",
                command: "Command",
            },
            "de-CH": {
                extensionName: "Verknüpfungen",
                shortcut: "Verknüpfung",
                shortcuts: "Verknüpfungen",
                invokeShortcut: "Verknüpfung aufrufen",
                type: "Typ",
                typeFile: "Datei",
                typeUrl: "URL",
                typeCommand: "Befehl",
                filePath: "Dateipfad",
                fileOrFolderDoesNotExist: "Datei/Ordner existiert nicht",
                name: "Name",
                invalidName: "Ungültiger Name",
                createShortcut: "Verknüpfung erstellen",
                editShortcut: "Verknüpfung bearbeiten",
                save: "Speichern",
                cancel: "Abbrechen",
                edit: "Bearbeiten",
                remove: "Entfernen",
                chooseFile: "Datei oder Ordner auswählen",
                command: "Befehl",
            },
        };
    }

    private async getSearchResultItemImages(shortcuts: Shortcut[]): Promise<Record<string, Image>> {
        const promiseResults = await Promise.allSettled(shortcuts.map((s) => this.getSearchResultItemImage(s)));

        const result: Record<string, Image> = {};

        for (let i = 0; i < shortcuts.length; i++) {
            const promiseResult = promiseResults[i];
            if (promiseResult.status === "fulfilled") {
                result[shortcuts[i].id] = promiseResult.value;
            } else {
                this.logger.error(
                    `Failed to create shortcut image for shortcut argument "${shortcuts[i].argument}". Reason: ${promiseResult.reason}`,
                );
            }
        }

        return result;
    }

    private async getSearchResultItemImage(shortcut: Shortcut): Promise<Image> {
        const map: Record<ShortcutType, (s: Shortcut) => Promise<Image>> = {
            File: async (s) => await this.fileImageGenerator.getImage(s.argument),
            Url: async (s) => this.urlImageGenerator.getImage(s.argument),
            Command: async () => this.getImage(), // TODO: Add image for command shortcuts
        };

        return await map[shortcut.type](shortcut);
    }
}
