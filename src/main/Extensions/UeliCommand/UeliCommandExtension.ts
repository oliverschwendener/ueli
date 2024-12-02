import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import type { SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";

export class UeliCommandExtension implements Extension {
    public readonly id = "UeliCommand";
    public readonly name = "Ueli Commands";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[UeliCommand]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly translator: Translator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const { t } = this.translator.createT(this.getI18nResources());

        const map: Record<string, SearchResultItem> = {
            quit: {
                id: "ueliCommand:quit",
                description: t("description"),
                name: t("quitUeli"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "quit",
                    description: t("quitUeli"),
                    requiresConfirmation: true,
                    fluentIcon: "DismissCircleRegular",
                    hideWindowAfterInvocation: true,
                },
            },
            settings: {
                id: "ueliCommand:settings",
                description: t("description"),
                name: t("openSettings"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "settings",
                    description: t("openSettings"),
                    fluentIcon: "SettingsRegular",
                },
            },
            extensions: {
                id: "ueliCommand:extensions",
                description: t("description"),
                name: t("openExtensions"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "extensions",
                    description: t("openExtensions"),
                    fluentIcon: "AppsAddInRegular",
                },
            },
            centerWindow: {
                id: "ueliCommand:centerWindow",
                description: t("description"),
                name: t("centerWindow"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "centerWindow",
                    description: t("centerWindow"),
                    fluentIcon: "AppsAddInRegular",
                },
            },
            rescanExtensions: {
                id: "ueliCommand:rescanExtensions",
                description: t("description"),
                name: t("rescanExtensions"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "rescanExtensions",
                    description: t("rescanExtensions"),
                    fluentIcon: "ArrowClockwiseRegular",
                },
            },
        };

        return Object.values(map);
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "app-icon-dark.png")}`,
            urlOnDarkBackground: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "app-icon-dark.png")}`,
            urlOnLightBackground: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "app-icon-light.png")}`,
        };
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue() {
        return undefined;
    }

    public getSettingKeysTriggeringRescan() {
        return ["general.language"];
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Ueli Commands",
                description: "Ueli Command",
                openSettings: "Open Ueli settings",
                openExtensions: "Browse Ueli extensions",
                centerWindow: "Center Ueli window",
                quitUeli: "Quit Ueli",
                rescanExtensions: "Rescan extensions",
            },
            "de-CH": {
                extensionName: "Ueli Befehle",
                description: "Ueli Befehl",
                openSettings: "Ueli-Einstellungen öffnen",
                openExtensions: "Ueli-Erweiterungen durchsuchen",
                centerWindow: "Ueli-Fenster zentrieren",
                quitUeli: "Ueli Beenden",
                rescanExtensions: "Erweiterungen neu scannen",
            },
        };
    }
}
