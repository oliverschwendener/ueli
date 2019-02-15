import { UserConfigOptions } from "../../common/config/user-config-options";
import { TranslationManager } from "../../common/translation/translation-manager";
import { TranslationRepository } from "../../common/translation/translation-repository";
import { EnglishTranslationRepository } from "../../common/translation/english-translation-repository";
import { GermanTranslationRepository } from "../../common/translation/german-translation-repository";

export function getProductionTranslationManager(userConfig: UserConfigOptions) {
    const translationRepositories: TranslationRepository[] = [
        new EnglishTranslationRepository(),
        new GermanTranslationRepository(),
    ];
    return new TranslationManager(userConfig, translationRepositories);
}
