export type InvocationArgument = {
    searchTerm: string;
    sourceLanguage: string;
    targetLanguage: string;
};

export type PostBody = {
    text: string[];
    target_lang: string;
    source_lang?: string;
};

export type ApiResponse = {
    translations: {
        detected_source_language: string;
        text: string;
    }[];
};

export type Settings = {
    apiKey: string;
    defaultSourceLanguage: string;
    defaultTargetLanguage: string;
};
