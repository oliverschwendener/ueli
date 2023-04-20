import { englishTranslationSet } from "./english-translation-set";
import { finnishTranslationSet } from "./finnish-translation-set";
import { germanTranslationSet } from "./german-translation-set";
import { hindiTranslationSet } from "./hindi-translation-set";
import { italianTranslationSet } from "./italian-translation-set";
import { japaneseTranslationSet } from "./japanese-translation-set";
import { koreanTranslationSet } from "./korean-translation-set";
import { Language } from "./language";
import { portugueseTranslationSet } from "./portuguese-translation-set";
import { russianTranslationSet } from "./russian-translation-set";
import { simplifiedChineseTranslationSet } from "./simplified-chinese-translation-set";
import { spanishTranslationSet } from "./spanish-translation-set";
import { traditionalChineseTranslationSet } from "./traditional-chinese-translation-set";
import { TranslationSet } from "./translation-set";
import { turkishTranslationSet } from "./turkish-translation-set";
import { ukrainianTranslationSet } from "./ukrainian-translation-set";

export function getTranslationSet(language: Language): TranslationSet {
    switch (language) {
        case Language.English:
            return englishTranslationSet;
        case Language.Finnish:
            return finnishTranslationSet;
        case Language.German:
            return germanTranslationSet;
        case Language.Hindi:
            return hindiTranslationSet;
        case Language.Portuguese:
            return portugueseTranslationSet;
        case Language.Russian:
            return russianTranslationSet;
        case Language.Turkish:
            return turkishTranslationSet;
        case Language.Spanish:
            return spanishTranslationSet;
        case Language.SimplifiedChinese:
            return simplifiedChineseTranslationSet;
        case Language.TraditionalChinese:
            return traditionalChineseTranslationSet;
        case Language.Korean:
            return koreanTranslationSet;
        case Language.Japanese:
            return japaneseTranslationSet;
        case Language.Italian:
            return italianTranslationSet;
        case Language.Ukrainian:
            return ukrainianTranslationSet;
        default:
            return englishTranslationSet;
    }
}
