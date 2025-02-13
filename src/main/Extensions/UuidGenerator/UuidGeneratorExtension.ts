import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import {
    createCopyToClipboardAction,
    createEmptyInstantSearchResult,
    createInvokeExtensionAction,
    type InstantSearchResultItems,
    type SearchResultItem,
} from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Resources, Translations } from "@common/Core/Translator";
import type { UuidGeneratorSetting as Settings, UuidVersion } from "@common/Extensions/UuidGenerator";
import { UuidGenerator } from "./UuidGenerator";

export class UuidGeneratorExtension implements Extension {
    public readonly id = "UuidGenerator";
    public readonly name = "UUID / GUID Generator";

    public readonly defaultSettings: Settings = {
        uuidVersion: "v4",
        numberOfUuids: 10,
        validateStrictly: true,
        generatorFormat: { uppercase: false, hyphens: true, braces: false, quotes: false },
        searchResultFormats: [],
    };

    public readonly author = {
        name: "Christopher Steiner",
        githubUserName: "ChristopherSteiner",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly translator: Translator,
        private readonly settingsManager: SettingsManager,
    ) {}

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        const uuidFormats = this.getSettingValue("searchResultFormats");
        const validateStrictly = this.getSettingValue("validateStrictly");

        let uuidSearchTerm = searchTerm;
        if (uuidSearchTerm.toLowerCase().startsWith("uuid") || uuidSearchTerm.toLowerCase().startsWith("guid")) {
            uuidSearchTerm = uuidSearchTerm.substring(4);
        }

        uuidSearchTerm = uuidSearchTerm.trim();
        const possibleUuid = UuidGenerator.reformat(uuidSearchTerm, {
            uppercase: false,
            hyphens: true,
            braces: false,
            quotes: false,
        });
        if (this.validateUuid(possibleUuid)) {
            return {
                after: [],
                before: uuidFormats.map((format, index) => {
                    const formattedUuid = UuidGenerator.format(possibleUuid, format, validateStrictly);

                    return {
                        name: formattedUuid,
                        description: "UUID Generator",
                        descriptionTranslation: {
                            key: "generatorResult",
                            namespace: "extension[UuidGenerator]",
                        },
                        id: "uuidGenerator:instantResult-" + index,
                        image: this.getImage(),
                        defaultAction: createCopyToClipboardAction({
                            textToCopy: formattedUuid,
                            description: "Copy UUID to clipboard",
                            descriptionTranslation: {
                                key: "copyUuidToClipboard",
                                namespace: "extension[UuidGenerator]",
                            },
                        }),
                    };
                }),
            };
        }

        if (!["uuid", "guid"].includes(searchTerm.toLowerCase())) {
            return createEmptyInstantSearchResult();
        }

        const generatedUuid = this.generateUuid(this.getSettingValue("uuidVersion"), false, true, false, false);

        return {
            after: [],
            before: uuidFormats.map((format, index) => {
                const formattedUuid = UuidGenerator.reformat(generatedUuid, format);

                return {
                    name: formattedUuid,
                    description: "UUID Generator",
                    descriptionTranslation: {
                        key: "generatorResult",
                        namespace: "extension[UuidGenerator]",
                    },
                    id: "uuidGenerator:instantResult-" + index,
                    image: this.getImage(),
                    defaultAction: createCopyToClipboardAction({
                        textToCopy: formattedUuid,
                        description: "Copy UUID to clipboard",
                        descriptionTranslation: {
                            key: "copyUuidToClipboard",
                            namespace: "extension[UuidGenerator]",
                        },
                    }),
                };
            }),
        };
    }

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const { t } = this.translator.createT(this.getI18nResources());

        return [
            {
                id: "UuidGenerator:invoke",
                description: t("openGeneratorDescription"),
                name: t("openGeneratorName"),
                image: this.getImage(),
                defaultAction: createInvokeExtensionAction({
                    extensionId: this.id,
                    description: t("openGeneratorDescription"),
                    fluentIcon: "OpenRegular",
                }),
            },
        ];
    }

    public getI18nResources(): Resources<Translations> {
        return {
            "en-US": {
                copyUuidToClipboard: "Copy UUID to clipboard",
                copyUuidsToClipboard: "Copy UUIDs to clipboard",
                extensionName: "UUID / GUID Generator",
                generatorResult: "UUID / GUID",
                openGeneratorDescription: "Open UUIDs / GUIDs Generator",
                openGeneratorName: "UUID / GUID Generator",
                uuidVersion: "UUID Version",
                numberOfUuids: "Number of UUIDs",
                validateStrictly: "Validate UUIDs strictly",
                uppercase: "Uppercase",
                hyphens: "Hyphens",
                braces: "Braces",
                quotes: "Quotes",
                defaultGeneratorFormat: "Generator window format",
                searchResultFormats: "Search result formats",
                addSearchResultFormat: "Add format",
                removeSearchResultFormat: "Remove format",
            },
            "de-CH": {
                copyUuidToClipboard: "UUID in die Zwischenablage kopieren",
                copyUuidsToClipboard: "UUIDs in die Zwischenablage kopieren",
                extensionName: "UUID / GUID Generator",
                generatorResult: "UUID / GUID",
                uuidVersion: "UUID Version",
                numberOfUuids: "Anzahl UUIDs",
                validateStrictly: "UUIDs strikt validieren",
                uppercase: "Grossbuchstaben",
                hyphens: "Bindestriche",
                braces: "Geschweifte Klammern",
                quotes: "Anführungszeichen",
                defaultGeneratorFormat: "Format im Generator-Fenster",
                searchResultFormats: "Formate der Suchresultate",
                addSearchResultFormat: "Format hinzufügen",
                removeSearchResultFormat: "Format entfernen",
            },
        };
    }

    public isSupported(): boolean {
        return true;
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "uuid-generator.png")}`,
        };
    }

    public getSettingDefaultValue<T extends keyof Settings>(key: T): Settings[T] {
        return this.defaultSettings[key];
    }

    private getSettingValue<T extends keyof Settings>(key: T): Settings[T] {
        return this.settingsManager.getValue(getExtensionSettingKey(this.id, key), this.getSettingDefaultValue(key));
    }

    public async invoke(settings: Settings): Promise<string[]> {
        const result = [];
        for (let index = 0; index < settings.numberOfUuids; index++) {
            result.push(
                this.generateUuid(
                    settings.uuidVersion,
                    settings.generatorFormat.uppercase,
                    settings.generatorFormat.hyphens,
                    settings.generatorFormat.braces,
                    settings.generatorFormat.quotes,
                ),
            );
        }
        return result;
    }

    private generateUuid(
        version: UuidVersion,
        uppercase: boolean,
        hyphens: boolean,
        braces: boolean,
        quotes: boolean,
    ): string {
        let uuid: string;

        switch (version) {
            case "v6": {
                uuid = UuidGenerator.generatev6();
                break;
            }
            case "v7": {
                uuid = UuidGenerator.generatev7();
                break;
            }
            case "v4":
            default: {
                uuid = UuidGenerator.generatev4();
                break;
            }
        }

        return UuidGenerator.format(uuid, { uppercase, hyphens, braces, quotes }, true);
    }

    private validateUuid(uuid: string): boolean {
        return this.getSettingValue("validateStrictly") === true
            ? UuidGenerator.validateUuidStrictly(uuid)
            : UuidGenerator.validateUuid(uuid);
    }
}
