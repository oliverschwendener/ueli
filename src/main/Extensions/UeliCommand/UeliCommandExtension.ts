import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import type { SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import { resources } from "./resources";

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
        const t = await this.translator.createInstance(resources);

        const map: Record<string, SearchResultItem> = {
            quit: {
                id: "ueliCommand:quit",
                description: t("ueliCommand.description"),
                name: t("ueliCommand.quitUeli"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "quit",
                    description: t("ueliCommand.quitUeli"),
                    hideWindowAfterInvocation: false,
                    requiresConfirmation: true,
                    fluentIcon: "DismissCircleRegular",
                },
            },
            settings: {
                id: "ueliCommand:settings",
                description: t("ueliCommand.description"),
                name: t("ueliCommand.openSettings"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "settings",
                    description: t("ueliCommand.openSettings"),
                    hideWindowAfterInvocation: false,
                    fluentIcon: "SettingsRegular",
                },
            },
            extensions: {
                id: "ueliCommand:extensions",
                description: t("ueliCommand.description"),
                name: t("ueliCommand.openExtensions"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "extensions",
                    description: t("ueliCommand.openExtensions"),
                    hideWindowAfterInvocation: false,
                    fluentIcon: "AppsAddInRegular",
                },
            },
            centerWindow: {
                id: "ueliCommand:centerWindow",
                description: t("ueliCommand.description"),
                name: t("ueliCommand.centerWindow"),
                image: this.getImage(),
                defaultAction: {
                    handlerId: "UeliCommand",
                    argument: "centerWindow",
                    description: t("ueliCommand.centerWindow"),
                    hideWindowAfterInvocation: false,
                    fluentIcon: "AppsAddInRegular",
                },
            },
        };

        return Object.values(map);
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "app-icon-dark.png")}`,
            urlOnDarkBackground: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "app-icon-light.png")}`,
            urlOnLightBackground: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "app-icon-dark.png")}`,
        };
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(): T {
        return undefined as T;
    }

    public getSettingKeysTriggeringRescan() {
        return ["general.language"];
    }
}
