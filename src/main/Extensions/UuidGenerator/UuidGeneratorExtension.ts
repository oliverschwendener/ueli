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
        uppercase: false,
        hyphens: true,
        braces: false,
        quotes: false,
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
        if (!["uuid", "guid"].includes(searchTerm.toLowerCase())) {
            return createEmptyInstantSearchResult();
        }

        const uuid = this.generateUuid(
            this.getSettingValue("uuidVersion"),
            this.getSettingValue("uppercase"),
            this.getSettingValue("hyphens"),
            this.getSettingValue("braces"),
            this.getSettingValue("quotes"),
        );

        return {
            after: [],
            before: [
                {
                    name: uuid,
                    description: "UUID Generator",
                    descriptionTranslation: {
                        key: "generatorResult",
                        namespace: "extension[UuidGenerator]",
                    },
                    id: "uuidGenerator:instantResult",
                    image: this.getImage(),
                    defaultAction: createCopyToClipboardAction({
                        textToCopy: uuid,
                        description: "Copy UUID to clipboard",
                        descriptionTranslation: {
                            key: "copyUuidToClipboard",
                            namespace: "extension[UuidGenerator]",
                        },
                    }),
                },
            ],
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
                uppercase: "Uppercase",
                hyphens: "Hyphens",
                braces: "Braces",
                quotes: "Quotes",
            },
            "de-CH": {
                copyUuidToClipboard: "UUID in die Zwischenablage kopieren",
                copyUuidsToClipboard: "UUIDs in die Zwischenablage kopieren",
                extensionName: "UUID / GUID Generator",
                generatorResult: "UUID / GUID",
                uuidVersion: "UUID Version",
                numberOfUuids: "Anzahl UUIDs",
                uppercase: "Grossbuchstaben",
                hyphens: "Bindestriche",
                braces: "Geschweifte Klammern",
                quotes: "Anführungszeichen",
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

    public getSettingDefaultValue(key: keyof Settings) {
        return this.defaultSettings[key];
    }

    public async invoke(settings: Settings): Promise<string[]> {
        const result = [];
        for (let index = 0; index < settings.numberOfUuids; index++) {
            result.push(
                this.generateUuid(
                    settings.uuidVersion,
                    settings.uppercase,
                    settings.hyphens,
                    settings.braces,
                    settings.quotes,
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

        return UuidGenerator.format(uuid, uppercase, hyphens, braces, quotes);
    }

    private getSettingValue<T>(key: keyof Settings): T {
        return this.settingsManager.getValue<T>(
            getExtensionSettingKey(this.id, key),
            <T>this.getSettingDefaultValue(key),
        );
    }
}
