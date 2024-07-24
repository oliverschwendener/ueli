import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";
import { Image } from "@common/Core/Image";
import { Buffer } from "buffer";

export class Base64Conversion implements Extension {
    private static readonly translationNamespace = "extension[Base64Conversion]";

    public readonly id = "Base64Conversion";
    public readonly name = "Base64 Conversion";

    public readonly author = {
        name: "Christopher Steiner",
        githubUserName: "ChristopherSteiner",
    };

    private readonly defaultSettings = {};

    public constructor(private readonly assetPathResolver: AssetPathResolver) {}

    public getInstantSearchResultItems(searchTerm: string): SearchResultItem[] {
        const parts = searchTerm.trim().split(" ");

        const validators = [
            () => parts.length === 3,
            () => ["base64", "b64", "b"].includes(parts[1].toLowerCase()),
            () => ["encode", "decode"].includes(parts[2].toLowerCase()),
        ];

        for (const validator of validators) {
            if (!validator()) {
                return [];
            }
        }

        let converted: string;
        let descriptionTranslationKey: string;

        if (parts[2].toLowerCase() === "encode") {
            converted = Buffer.from(parts[0], "binary").toString("base64");
            descriptionTranslationKey = "base64Encoded";
        } else if (parts[2].toLowerCase() === "decode") {
            converted = Buffer.from(parts[0], "base64").toString("binary");
            descriptionTranslationKey = "base64Decoded";
        } else {
            return [];
        }

        return [
            {
                defaultAction: SearchResultItemActionUtility.createCopyToClipboardAction({
                    textToCopy: converted,
                    description: "Base64 Conversion",
                    descriptionTranslation: {
                        key: "copyToClipboard",
                        namespace: Base64Conversion.translationNamespace,
                    },
                }),
                description: "Base64 Conversion",
                descriptionTranslation: {
                    key: descriptionTranslationKey,
                    namespace: Base64Conversion.translationNamespace,
                },
                id: `base64-conversion:instant-result`,
                image: this.getImage(),
                name: converted,
            },
        ];
    }

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.defaultSettings[key];
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "base64-conversion.png")}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Base64 Conversion",
                copyToClipboard: "Copy to clipboard",
                base64Encoded: "Base64 Encoded",
                base64Decoded: "Base64 Decoded",
            },
            "de-CH": {
                extensionName: "Base64 Konvertierung",
                copyToClipboard: "In Zwischenablage kopieren",
                base64Encoded: "Base64 Kodiert",
                base64Decoded: "Base64 Dekodiert",
            },
        };
    }
}
