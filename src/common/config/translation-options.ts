import { TranslationLanguage } from "../../main/plugins/translation-execution-plugin/translation-language";

export interface TranslationOptions {
    enabled: boolean;
    debounceDelay: number;
    minSearchTermLength: number;
    prefix: string;
    sourceLanguage: TranslationLanguage;
    targetLanguage: TranslationLanguage;
}
