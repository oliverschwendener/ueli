import { Language } from "./language";
import { TranslationKey } from "./translation-key";

export interface TranslationRepository {
    getLanguage(): Language;
    getTranslation(translationKey: TranslationKey): string;
}
