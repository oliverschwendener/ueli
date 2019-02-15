import { TranslationRepository } from "./translation-repository";
import { Language } from "./language";
import { TranslationKey } from "./translation-key";
import { missingTranslation } from "./missing-translation";

export class EnglishTranslationRepository implements TranslationRepository {
    private readonly language = Language.English;

    public getLanguage(): Language {
        return this.language;
    }

    public getTranslation(translationKey: TranslationKey): string {
        switch (translationKey) {
            // ueli commands
            case TranslationKey.UeliCommandQuit:
                return "Quit";
            case TranslationKey.UeliCommandQuitDescription:
                return "Quit ueli";
            case TranslationKey.UeliCommandReload:
                return "Reload";
            case TranslationKey.UeliCommandReloadDescription:
                return "Reload ueli";
            case TranslationKey.UeliCommandEditSettingsFile:
                return "Edit settings file";
            case TranslationKey.UeliCommandEditSettingsFileDescription:
                return "Edit the settings file with your default text editor";
            case TranslationKey.UeliCommandOpenSettings:
                return "Settings";
            case TranslationKey.UeliCommandOpenSettingsDescription:
                return "Open settings";
            case TranslationKey.UeliCommandRefreshIndexes:
                return "Refresh indexes";
            case TranslationKey.UeliCommandRefreshIndexesDescription:
                return "Refreshes all indexes of all ueli plugins";
            case TranslationKey.UeliCommandClearCaches:
                return "Clear caches";
            case TranslationKey.UeliCommandClearCachesDescription:
                return "Cleares all caches of all ueli plugins";

            // errors
            case TranslationKey.NoSearchResultsFoundTitle:
                return "No search results found";
            case TranslationKey.NoSearchResultsFoundDescription:
                return "";
            case TranslationKey.GeneralErrorTitle:
                return "An error occurred";
            case TranslationKey.GeneralErrorDescription:
                return "Check ueli's log for more details";

            // Common stuff
            case TranslationKey.SuccessfullyClearedCaches:
                return "Successfully cleared caches";
            case TranslationKey.SuccessfullyClearedCachesBeforeAppQuit:
                return "Successfully cleared caches before app quit";
            case TranslationKey.SuccessfullyRefreshedIndexes:
                return "Successfully refreshed indexes";
            case TranslationKey.SuccessfullyUpdatedConfig:
                return "Successfully updated config";
            default:
                return missingTranslation;
        }
    }
}
