import { TranslationSet } from "./translation-set";
import { Language } from "./language";
import { englishTranslationSet } from "./english-translation-set";
import { germanTranslationSet } from "./german-translation-set";
import { russianTranslationSet } from "./russian-translation-set";

export function getTranslationSet(language: Language): TranslationSet {
    switch (language) {
        case Language.English:
            return englishTranslationSet;
        case Language.German:
            return germanTranslationSet;
        case Language.Russian:
            return russianTranslationSet;
        default:
            return englishTranslationSet;
    }
}
