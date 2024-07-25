import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { Resources, Translations } from "@common/Core/Translator";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { ColorConverter } from "./ColorConverter";

export class ColorConverterExtension implements Extension {
    public readonly id = "ColorConverter";

    public readonly name = "Color Converter";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[ColorConverter]",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    private readonly defaultSettings = {
        colorSystems: ["HEX", "HLS", "RGB"],
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
        private readonly colorConverter: ColorConverter,
    ) {}

    async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(key: string): T {
        return this.defaultSettings[key] as T;
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "color-converter.png")}`,
        };
    }

    public getI18nResources(): Resources<Translations> {
        return {
            "en-US": {
                colorSystems: "Color Systems",
                selectAColorSystem: "Select a color system",
                color: "{{ colorSystem }} Color",
                copyColorToClipboard: "Copy color to clipboard",
                extensionName: "Color Converter",
            },
            "de-CH": {
                colorSystems: "Farbsysteme",
                selectAColorSystem: "Wähle ein Farbsystem",
                color: "{{ colorSystem }} Farbe",
                copyColorToClipboard: "Farbe in die Zwischenablage kopieren",
                extensionName: "Farbkonverter",
            },
        };
    }

    public getInstantSearchResultItems(searchTerm: string): SearchResultItem[] {
        const { t } = this.translator.createT(this.getI18nResources());

        return this.colorConverter
            .convertFromString(searchTerm)
            .filter(({ colorSystem }) => this.getEnabledColorSystems().includes(colorSystem))
            .map(({ colorSystem, value }) => ({
                defaultAction: SearchResultItemActionUtility.createCopyToClipboardAction({
                    textToCopy: value,
                    description: "Copy color to clipboard",
                    descriptionTranslation: {
                        key: "copyColorToClipboard",
                        namespace: "extension[ColorConverter]",
                    },
                }),
                description: t("color", { colorSystem }),
                id: `color-${value}-${colorSystem}`,
                image: this.getImage(),
                name: value,
            }));
    }

    private getEnabledColorSystems(): string[] {
        return this.settingsManager.getValue(`extension[${this.id}].colorSystems`, this.defaultSettings.colorSystems);
    }
}
