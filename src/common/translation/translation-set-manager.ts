import * as englishTranslationSet from "./english-translation-set";
import * as finnishTranslationSet from "./finnish-translation-set";
import * as germanTranslationSet from "./german-translation-set";
import * as hindiTranslationSet from "./hindi-translation-set";
import * as italianTranslationSet from "./italian-translation-set";
import * as japaneseTranslationSet from "./japanese-translation-set";
import * as koreanTranslationSet from "./korean-translation-set";
import { Language } from "./language";
import * as portugueseTranslationSet from "./portuguese-translation-set";
import * as russianTranslationSet from "./russian-translation-set";
import * as simplifiedChineseTranslationSet from "./simplified-chinese-translation-set";
import * as spanishTranslationSet from "./spanish-translation-set";
import * as traditionalChineseTranslationSet from "./traditional-chinese-translation-set";
import { TranslationSet } from "./translation-set";
import * as turkishTranslationSet from "./turkish-translation-set";
import * as ukrainianTranslationSet from "./ukrainian-translation-set";
import * as czechTranslationSet from "./czech-translation-set";

export function getTranslationSet(language: Language): TranslationSet {
    switch (language) {
        case Language.English:
            return englishTranslationSet.translationSet;
        case Language.Finnish:
            return finnishTranslationSet.translationSet;
        case Language.German:
            return germanTranslationSet.translationSet;
        case Language.Hindi:
            return hindiTranslationSet.translationSet;
        case Language.Portuguese:
            return portugueseTranslationSet.translationSet;
        case Language.Russian:
            return russianTranslationSet.translationSet;
        case Language.Turkish:
            return turkishTranslationSet.translationSet;
        case Language.Spanish:
            return spanishTranslationSet.translationSet;
        case Language.SimplifiedChinese:
            return simplifiedChineseTranslationSet.translationSet;
        case Language.TraditionalChinese:
            return traditionalChineseTranslationSet.translationSet;
        case Language.Korean:
            return koreanTranslationSet.translationSet;
        case Language.Japanese:
            return japaneseTranslationSet.translationSet;
        case Language.Italian:
            return italianTranslationSet.translationSet;
        case Language.Ukrainian:
            return ukrainianTranslationSet.translationSet;
        case Language.Czech:
            return czechTranslationSet.translationSet;
        default:
            return englishTranslationSet.translationSet;
    }
}
