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
import type { InvocationArgument, Base64ConversionSettings as Settings } from "@common/Extensions/Base64Conversion";
import { Base64Converter } from "./Base64Converter";
import type { InvocationResult } from "./InvocationResult";

export class Base64Conversion implements Extension {
    public readonly id = "Base64Conversion";
    public readonly name = "Base64 Conversion";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[Base64Conversion]",
    };

    public readonly defaultSettings: Settings = {
        encodeDecodePrefix: "b64",
        encodePrefix: "b64e",
        decodePrefix: "b64d",
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
        const encodeDecodePrefix = this.getSettingValue("encodeDecodePrefix");
        const encodePrefix = this.getSettingValue("encodePrefix");
        const decodePrefix = this.getSettingValue("decodePrefix");

        const results: InvocationResult[] = [];

        if (searchTerm.toLowerCase().startsWith(encodePrefix + " ") && searchTerm.length > encodePrefix.length + 1) {
            results.push({
                action: "encoded",
                value: Base64Converter.encode(searchTerm.substring(encodePrefix.length).trim()),
            });
        } else if (
            searchTerm.toLowerCase().startsWith(decodePrefix + " ") &&
            searchTerm.length > decodePrefix.length + 1
        ) {
            results.push({
                action: "decoded",
                value: Base64Converter.decode(searchTerm.substring(decodePrefix.length).trim()),
            });
        } else if (
            searchTerm.toLowerCase().startsWith(encodeDecodePrefix + " ") &&
            searchTerm.length > encodeDecodePrefix.length + 1
        ) {
            results.push({
                action: "encoded",
                value: Base64Converter.encode(searchTerm.substring(encodeDecodePrefix.length).trim()),
            });
            results.push({
                action: "decoded",
                value: Base64Converter.decode(searchTerm.substring(encodeDecodePrefix.length).trim()),
            });
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

    public getSettingDefaultValue<T extends keyof Settings>(key: T): Settings[T] {
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
                searchResultItemDescription: "Encode or decode Base64",
                searchResultItemName: "Base64 Conversion",
                searchResultItemActionDescription: "Open Base64 Conversion",
                copyToClipboard: "Copy result to clipboard",
                encodePlaceHolder: "Enter your string to encode here",
                decodePlaceHolder: "Enter your string to decode here",
                encoded: "Encoded",
                decoded: "Decoded",
                encodeDecodePrefix: "Prefix used for encoding and decoding",
                encodePrefix: "Prefix used for encoding",
                decodePrefix: "Prefix used for decoding",
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
                encodeDecodePrefix: "Präfix für Kodierung und Dekodierung",
                encodePrefix: "Präfix für Kodierung",
                decodePrefix: "Präfix für Dekodierung",
            },
            "ja-JP": {
                extensionName: "Base64変換",
                searchResultItemDescription: "Base64エンコード/デコード",
                searchResultItemName: "Base64変換 | Base64 Conversion",
                searchResultItemActionDescription: "Base64変換対象を開く",
                copyToClipboard: "結果をクリップボードにコピー",
                encodePlaceHolder: "エンコードしたい文字列を入力",
                decodePlaceHolder: "デコードしたい文字列を入力",
                encoded: "エンコード済み",
                decoded: "デコード済み",
                encodeDecodePrefix: "変換時に接頭辞を使用する",
                encodePrefix: "エンコード時の接頭辞",
                decodePrefix: "デコード時の接頭辞",
            },
            "ko-KR": {
                extensionName: "Base64 변환",
                searchResultItemDescription: "Base64 인코딩/디코딩",
                searchResultItemName: "Base64 변환 | Base64 Conversion",
                searchResultItemActionDescription: "Base64 변환 항목 열기",
                copyToClipboard: "결과를 클립보드에 복사",
                encodePlaceHolder: "인코딩할 문자열 입력",
                decodePlaceHolder: "디코딩할 문자열 입력",
                encoded: "인코딩됨",
                decoded: "디코딩됨",
                encodeDecodePrefix: "변환 시 접두사 사용",
                encodePrefix: "인코딩 시 접두사",
                decodePrefix: "디코딩 시 접두사",
            },
        };
    }

    private getSettingValue<T extends keyof Settings>(key: T): Settings[T] {
        return this.settingsManager.getValue(getExtensionSettingKey(this.id, key), this.getSettingDefaultValue(key));
    }
}
