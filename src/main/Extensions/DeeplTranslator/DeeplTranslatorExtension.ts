import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import { createInvokeExtensionAction, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { Net } from "electron";
import type { ApiResponse, PostBody } from "./Api";
import type { InvocationArgument } from "./InvocationArgument";
import type { Settings } from "./Settings";

export class DeeplTranslatorExtension implements Extension {
    public readonly id = "DeeplTranslator";
    public readonly name = "DeepL Translator";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[DeeplTranslator]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    private readonly defaultSettings: Settings = {
        apiKey: "",
        defaultSourceLanguage: "Auto",
        defaultTargetLanguage: "EN-US",
    };

    public constructor(
        private readonly net: Net,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const { t } = this.translator.createT(this.getI18nResources());

        return [
            {
                id: "DeeplTranslator:invoke",
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

    public async invoke(argument: InvocationArgument): Promise<string[]> {
        const apiResponse = await this.getApiResponse(this.getPostBody(argument));
        return apiResponse.translations.map((t) => t.text);
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue(key: keyof Settings) {
        return this.defaultSettings[key];
    }

    public getImage(): Image {
        return {
            url: `file://${this.getDeeplAssetFilePath()}`,
        };
    }

    public getSettingKeysTriggeringRescan() {
        return ["general.language"];
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "DeepL Translator",
                openAccount: "Open DeepL Account",
                searchResultItemDescription: "Translate with DeepL",
                searchResultItemName: "DeepL Translator",
                searchResultItemActionDescription: "Open DeepL Translator",
            },
            "de-CH": {
                extensionName: "DeepL Übersetzer",
                openAccount: "DeepL Account öffnen",
                searchResultItemDescription: "Mit DeepL übersetzen",
                searchResultItemName: "DeepL Übersetzer",
                searchResultItemActionDescription: "DeepL Übersetzer öffnen",
            },
            "ja-JP": {
                extensionName: "DeepL翻訳",
                openAccount: "DeepLアカウントを開く",
                searchResultItemDescription: "DeepL翻訳",
                searchResultItemName: "DeepL翻訳 | DeepL Translator",
                searchResultItemActionDescription: "DeepL翻訳を開く",
            },
        };
    }

    private getDeeplAssetFilePath() {
        return this.assetPathResolver.getExtensionAssetPath(this.id, "deepl-logo.svg");
    }

    private getPostBody({ searchTerm, sourceLanguage, targetLanguage }: InvocationArgument): PostBody {
        const postBody: PostBody = {
            text: [searchTerm],
            target_lang: targetLanguage,
        };

        if (sourceLanguage !== "Auto") {
            postBody.source_lang = sourceLanguage;
        }

        return postBody;
    }

    private async getApiResponse(postBody: PostBody): Promise<ApiResponse> {
        const response = await this.net.fetch("https://api-free.deepl.com/v2/translate", {
            method: "POST",
            headers: {
                Authorization: `DeepL-Auth-Key ${this.getApiKey()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postBody),
        });

        if (!response.ok) {
            throw new Error(`DeepL API error: ${response.statusText}`);
        }

        return (await response.json()) as ApiResponse;
    }

    private getApiKey(): string {
        const apiKey = this.settingsManager.getValue<string | undefined>(
            getExtensionSettingKey(this.id, "apiKey"),
            undefined,
            true,
        );

        if (!apiKey) {
            throw new Error("Missing DeepL API key");
        }

        return apiKey;
    }
}
