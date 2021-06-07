import { TranslationSet } from "./translation-set";
import { Language } from "./language";
import { englishTranslationSet } from "./english-translation-set";
import { germanTranslationSet } from "./german-translation-set";
import { russianTranslationSet } from "./russian-translation-set";
import { turkishTranslationSet } from "./turkish-translation-set";
import { portugueseTranslationSet } from "./portuguese-translation-set";
import { spanishTranslationSet } from "./spanish-translation-set";
import { chineseTranslationSet } from "./chinese-translation-set";
import { koreanTranslationSet } from "./korean-translation-set";
import { japaneseTranslationSet } from "./japanese-translation-set";

export function getTranslationSet(language: Language): TranslationSet {
    switch (language) {
        case Language.English:
            return englishTranslationSet;
        case Language.German:
            return germanTranslationSet;
        case Language.Portuguese:
            return portugueseTranslationSet;
        case Language.Russian:
            return russianTranslationSet;
        case Language.Turkish:
            return turkishTranslationSet;
        case Language.Spanish:
            return spanishTranslationSet;
        case Language.Chinese:
            return chineseTranslationSet;
        case Language.Korean:
            return koreanTranslationSet;
        case Language.Japanese:
            return japaneseTranslationSet;
        default:
            return englishTranslationSet;
    }
}
