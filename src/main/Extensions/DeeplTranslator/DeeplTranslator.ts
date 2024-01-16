import type { Extension } from "@Core/Extension";
import type { ExtensionAssetPathResolver } from "@Core/ExtensionAssets";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Net } from "electron";
import { resources } from "./resources";

type InvokationArgument = {
    searchTerm: string;
    sourceLanguage: string;
    targetLanguage: string;
};

type PostBody = {
    text: string[];
    target_lang: string;
    source_lang?: string;
};

type ApiResponse = {
    translations: {
        detected_source_language: string;
        text: string;
    }[];
};

export class DeeplTranslator implements Extension {
    public readonly id = "DeeplTranslator";
    public readonly name = "DeepL Translator";
    public readonly nameTranslationKey? = "DeeplTranslator";
    public readonly settingKeysTriggerindReindex = ["general.language"];

    public constructor(
        private readonly net: Net,
        private readonly extensionAssetPathResolver: ExtensionAssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const t = await this.translator.createInstance(resources);

        return [
            {
                id: "DeeplTranslator:invoke",
                description: t("searchResultItem.description"),
                name: t("searchResultItem.name"),
                imageUrl: this.getFileImageUrl(),
                defaultAction: {
                    argument: `/extension/${this.id}`,
                    description: "",
                    handlerId: "navigateTo",
                    hideWindowAfterInvokation: false,
                },
            },
        ];
    }

    public async invoke(argument: InvokationArgument): Promise<string[]> {
        const apiResponse = await this.getApiResponse(this.getPostBody(argument));
        return apiResponse.translations.map((t) => t.text);
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(key: string): T {
        const defaultValues: Record<string, unknown> = {
            apiKey: "",
            defaultSourceLanguage: "Auto",
            defaultTargetLanguage: "EN-US",
        };

        return defaultValues[key] as T;
    }

    public getImageUrl(): string {
        return this.getFileImageUrl();
    }

    private getDeeplAssetFilePath() {
        return this.extensionAssetPathResolver.getAssetFilePath(this.id, "deepl-logo.svg");
    }

    private getFileImageUrl() {
        return `file://${this.getDeeplAssetFilePath()}`;
    }

    private getPostBody({ searchTerm, sourceLanguage, targetLanguage }: InvokationArgument): PostBody {
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
