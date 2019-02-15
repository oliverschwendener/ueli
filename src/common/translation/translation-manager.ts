import { TranslationRepository } from "./translation-repository";
import { UserConfigOptions } from "../config/user-config-options";
import { Language } from "./language";
import { TranslationKey } from "./translation-key";

export class TranslationManager {
    private readonly translationRepositories: TranslationRepository[];
    private config: UserConfigOptions;

    constructor(userConfig: UserConfigOptions, translationRepositories: TranslationRepository[]) {
        this.config = userConfig;
        this.translationRepositories = translationRepositories;
    }

    public getAllAvailableLanguages(): Language[] {
        return this.translationRepositories.map((repo) => repo.getLanguage());
    }

    public getTranslation(translationKey: TranslationKey): string {
        const currentTranslationRepo = this.translationRepositories.find((repo) => repo.getLanguage() === this.config.generalOptions.language);
        if (!currentTranslationRepo) {
            throw new Error("Unsupported language");
        }
        return currentTranslationRepo.getTranslation(translationKey);
    }

    public updateConfig(updatedUserConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedUserConfig;
            resolve();
        });
    }
}
