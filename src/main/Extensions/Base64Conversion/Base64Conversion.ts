import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import { type SearchResultItem, SearchResultItemActionUtility } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { InvocationArgument } from "@common/Extensions/Base64Conversion";
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

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const { t } = this.translator.createT(this.getI18nResources());

        return [
            {
                id: "Base64Converison:invoke",
                description: t("searchResultItemDescription"),
                name: t("searchResultItemName"),
                image: this.getImage(),
                defaultAction: SearchResultItemActionUtility.createInvokeExtensionAction({
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
            },
            "de-CH": {
                extensionName: "Base64 Konvertierung",
                searchResultItemDescription: "Base64 kodieren oder dekodieren",
                searchResultItemName: "Base64 Konvertierung",
                searchResultItemActionDescription: "Base64 Konvertierung öffnen",
                copyToClipboard: "Resultat in Zwischenablage kopieren",
                encodePlaceHolder: "Geben Sie Ihren zu kodierenden Text hier ein",
                decodePlaceHolder: "Geben Sie Ihren zu dekodierenden Text hier ein",
            },
        };
    }
}
