import type { Extension } from "@Core/Extension";
import type { ExtensionAssetPathResolver } from "@Core/ExtensionAssets";
import type { SettingsManager } from "@Core/SettingsManager";
import type { SearchResultItem } from "@common/SearchResultItem";
import type { Net } from "electron";

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
    public id = "DeeplTranslator";
    public name = "DeepL Translator";
    public nameTranslationKey? = "DeeplTranslator";

    public constructor(
        private readonly net: Net,
        private readonly extensionAssetPathResolver: ExtensionAssetPathResolver,
        private readonly settingsManager: SettingsManager,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [
            {
                id: "DeeplTranslator:invoke",
                description: "Translate with DeepL",
                name: "DeepL Translator",
                imageUrl: this.getFileImageUrl(),
                defaultAction: {
                    argument: `/extension/${this.id}`,
                    description: "Blub",
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

        return (await response.json()) as ApiResponse;
    }

    private getApiKey(): string {
        const apiKey = this.settingsManager.getExtensionSettingByKey<string | undefined>(this.id, "apiKey", undefined);

        if (!apiKey) {
            throw new Error("Missing DeepL API key");
        }

        return apiKey;
    }
}
