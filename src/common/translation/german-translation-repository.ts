import { TranslationRepository } from "./translation-repository";
import { Language } from "./language";
import { TranslationKey } from "./translation-key";
import { missingTranslation } from "./missing-translation";

export class GermanTranslationRepository implements TranslationRepository {
    private readonly language = Language.Deutsch;

    public getLanguage(): Language {
        return this.language;
    }

    public getTranslation(translationKey: TranslationKey): string {
        switch (translationKey) {
                // ueli commands
                case TranslationKey.UeliCommandQuit:
                return "Beenden";
            case TranslationKey.UeliCommandQuitDescription:
                return "ueli beenden";
            case TranslationKey.UeliCommandReload:
                return "Neu laden";
            case TranslationKey.UeliCommandReloadDescription:
                return "ueli neu laden";
            case TranslationKey.UeliCommandEditSettingsFile:
                return "Einstellungsdatei bearbeiten";
            case TranslationKey.UeliCommandEditSettingsFileDescription:
                return "Bearbeite die Einstellungsdatei mit deinem Texteditor";
            case TranslationKey.UeliCommandOpenSettings:
                return "Einstellungen";
            case TranslationKey.UeliCommandOpenSettingsDescription:
                return "Einstellungen öffnen";
            case TranslationKey.UeliCommandRefreshIndexes:
                return "Indexe aktualisieren";
            case TranslationKey.UeliCommandRefreshIndexesDescription:
                return "Aktualisiert alle Indexe von allen ueli Plugins";
            case TranslationKey.UeliCommandClearCaches:
                return "Caches löschen";
            case TranslationKey.UeliCommandClearCachesDescription:
                return "Löscht alle Caches von allen ueli Plugins";

            // errors
            case TranslationKey.NoSearchResultsFoundTitle:
                return "Keine Suchergebnisse gefunden";
            case TranslationKey.NoSearchResultsFoundDescription:
                return "";
            case TranslationKey.GeneralErrorTitle:
                return "Es ist ein Fehler aufgetreten";
            case TranslationKey.GeneralErrorDescription:
                return "Überprüfe den Log von ueli für weitere Details";

            // common stuff
            case TranslationKey.SuccessfullyClearedCaches:
                return "Erfolgreich alle Caches gelöscht";
            case TranslationKey.SuccessfullyClearedCachesBeforeAppQuit:
                return "Erfolgreich alle Caches vor dem Beenden gelöscht";
            case TranslationKey.SuccessfullyRefreshedIndexes:
                return "Erfolgreich alle Indexe erneuert";
            case TranslationKey.SuccessfullyUpdatedConfig:
                return "Erfolgreich Konfiguration aktualisiert";
            default:
                return missingTranslation;
        }
    }
}
