import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { UeliCommand } from "@Core/UeliCommand";
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
        private readonly settingsManager: SettingsManager,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const { t } = this.translator.createT(this.getI18nResources());

        const commonSearchResultItems: SearchResultItem[] = [
            {
                id: "ueliCommand:quit",
                description: t("description"),
                name: t("quitUeli"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: <UeliCommand>"quit",
                    description: t("quitUeli"),
                    requiresConfirmation: true,
                    fluentIcon: "DismissCircleRegular",
                    hideWindowAfterInvocation: true,
                },
            },
            {
                id: "ueliCommand:settings",
                description: t("description"),
                name: t("openSettings"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: <UeliCommand>"openSettings",
                    description: t("openSettings"),
                    fluentIcon: "SettingsRegular",
                },
            },
            {
                id: "ueliCommand:extensions",
                description: t("description"),
                name: t("openExtensions"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: <UeliCommand>"openExtensions",
                    description: t("openExtensions"),
                    fluentIcon: "AppsAddInRegular",
                },
            },
            {
                id: "ueliCommand:centerWindow",
                description: t("description"),
                name: t("centerWindow"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: <UeliCommand>"centerWindow",
                    description: t("centerWindow"),
                    fluentIcon: "AppsAddInRegular",
                },
            },
            {
                id: "ueliCommand:rescanExtensions",
                description: t("description"),
                name: t("rescanExtensions"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: <UeliCommand>"rescanExtensions",
                    description: t("rescanExtensions"),
                    fluentIcon: "ArrowClockwiseRegular",
                },
            },
        ];

        const hotkeyIsEnabled = this.settingsManager.getValue("general.hotkey.enabled", true);

        const hotkeySearchResultItems: SearchResultItem[] = hotkeyIsEnabled
            ? [
                  {
                      id: "ueliCommand:toggleHotkey",
                      description: t("description"),
                      name: t("disableHotkey"),
                      image: this.getImage(),
                      defaultAction: {
                          handlerId: "UeliCommand",
                          argument: <UeliCommand>"disableHotkey",
                          description: t("disableHotkey"),
                          fluentIcon: "DismissCircleRegular",
                      },
                  },
              ]
            : [
                  {
                      id: "ueliCommand:toggleHotkey",
                      description: t("description"),
                      name: t("enableHotkey"),
                      image: this.getImage(),
                      defaultAction: {
                          handlerId: "UeliCommand",
                          argument: <UeliCommand>"enableHotkey",
                          description: t("enableHotkey"),
                          fluentIcon: "CheckmarkCircleRegular",
                      },
                  },
              ];

        return [...commonSearchResultItems, ...hotkeySearchResultItems];
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
        return ["general.language", "general.hotkey.enabled"];
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
                disableHotkey: "Disable hotkey",
                enableHotkey: "Enable hotkey",
            },
            "de-CH": {
                extensionName: "Ueli Befehle",
                description: "Ueli Befehl",
                openSettings: "Ueli-Einstellungen öffnen",
                openExtensions: "Ueli-Erweiterungen durchsuchen",
                centerWindow: "Ueli-Fenster zentrieren",
                quitUeli: "Ueli Beenden",
                rescanExtensions: "Erweiterungen neu scannen",
                disableHotkey: "Tastenkombination deaktivieren",
                enableHotkey: "Tastenkombination aktivieren",
            },
        };
    }
}
