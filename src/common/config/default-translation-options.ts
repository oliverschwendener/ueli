import { TranslationOptions } from "./translation-options";
import { TranslationLanguage } from "../../main/plugins/translation-plugin/translation-language";

export const defaultTranslationOptions: TranslationOptions = {
    debounceDelay: 250,
    enabled: false,
    minSearchTermLength: 3,
    prefix: "t?",
    sourceLanguage: TranslationLanguage.German,
    targetLanguage: TranslationLanguage.English,
};
