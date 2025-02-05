import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import {
    createCopyToClipboardAction,
    createEmptyInstantSearchResult,
    createInvokeExtensionAction,
    type InstantSearchResultItems,
    type SearchResultItem,
} from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { InvocationArgument, InvocationResult } from "@common/Extensions/Base64Conversion";
import { Base64Converter } from "./Base64Converter";

export class Base64Conversion implements Extension {
    public readonly id = "Base64Conversion";
    public readonly name = "Base64 Conversion";

    public readonly author = {
        name: "Christopher Steiner",
        githubUserName: "ChristopherSteiner",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly translator: Translator,
    ) {}

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        const results: InvocationResult[] = [];
        if (searchTerm.toLowerCase().startsWith("b64e ") && searchTerm.length > 5) {
            results.push({ action: "encoded", value: Base64Converter.encode(searchTerm.substring(4).trim()) });
        } else if (searchTerm.toLowerCase().startsWith("b64d ") && searchTerm.length > 5) {
            results.push({ action: "decoded", value: Base64Converter.decode(searchTerm.substring(4).trim()) });
        } else if (searchTerm.toLowerCase().startsWith("b64 ") && searchTerm.length > 4) {
            results.push({ action: "encoded", value: Base64Converter.encode(searchTerm.substring(3).trim()) });
            results.push({ action: "decoded", value: Base64Converter.decode(searchTerm.substring(3).trim()) });
        } else {
            return createEmptyInstantSearchResult();
        }

        return {
            after: [],
            before: results.map((result, index) => {
                return {
                    name: result.value,
                    description: "Base64 Conversion",
                    descriptionTranslation: {
                        key: result.action,
                        namespace: "extension[Base64Conversion]",
                    },
                    id: "base64Conversion:instantResult-" + index,
                    image: this.getImage(),
                    defaultAction: createCopyToClipboardAction({
                        textToCopy: result.value,
                        description: "Copy result to clipboard",
                        descriptionTranslation: {
                            key: "copyToClipboard",
                            namespace: "extension[Base64Conversion]",
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
                id: "Base64Converison:invoke",
                description: t("searchResultItemDescription"),
                name: t("searchResultItemName"),
                image: this.getImage(),
                defaultAction: createInvokeExtensionAction({
                    extensionId: this.id,
                    description: t("searchResultItemActionDescription"),
                    fluentIcon: "OpenRegular",
                }),
            },
        ];
    }

    public async invoke({ action, payload }: InvocationArgument): Promise<string> {
        return action === "encode" ? Base64Converter.encode(payload) : Base64Converter.decode(payload);
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue() {
        return undefined;
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
                searchResultItemDescription: "Encode or decode Base64",
                searchResultItemName: "Base64 Conversion",
                searchResultItemActionDescription: "Open Base64 Conversion",
                copyToClipboard: "Copy result to clipboard",
                encodePlaceHolder: "Enter your string to encode here",
                decodePlaceHolder: "Enter your string to decode here",
                encoded: "Encoded",
                decoded: "Decoded",
            },
            "de-CH": {
                extensionName: "Base64 Konvertierung",
                searchResultItemDescription: "Base64 kodieren oder dekodieren",
                searchResultItemName: "Base64 Konvertierung",
                searchResultItemActionDescription: "Base64 Konvertierung öffnen",
                copyToClipboard: "Resultat in Zwischenablage kopieren",
                encodePlaceHolder: "Geben Sie Ihren zu kodierenden Text hier ein",
                decodePlaceHolder: "Geben Sie Ihren zu dekodierenden Text hier ein",
                encoded: "Kodiert",
                decoded: "Dekodiert",
            },
        };
    }
}
