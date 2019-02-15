import { TranslationRepository } from "./translation-repository";
import { Language } from "./language";
import { TranslationKey } from "./translation-key";

export class TranslationManager {
    private readonly translationRepositories: TranslationRepository[];
    private currentLanguage: Language;

    constructor(initLanguage: Language, translationRepositories: TranslationRepository[]) {
        this.currentLanguage = initLanguage;
        this.translationRepositories = translationRepositories;
    }

    public getAllAvailableLanguages(): Language[] {
        return this.translationRepositories.map((repo) => repo.getLanguage());
    }

    public getTranslation(translationKey: TranslationKey): string {
        const currentTranslationRepo = this.translationRepositories.find((repo) => repo.getLanguage() === this.currentLanguage);
        if (!currentTranslationRepo) {
            throw new Error("Unsupported language");
        }
        return currentTranslationRepo.getTranslation(translationKey);
    }

    public updateLanguage(language: Language): Promise<void> {
        return new Promise((resolve) => {
            this.currentLanguage = language;
            resolve();
        });
    }
}
