import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { Resources, Translations } from "@common/Core/Translator";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import Color from "color";

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
        colorSystems: ["CMYK", "HEX", "HLS", "RGB"],
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
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
                colorSystem: "Color System",
                selectAColorSystem: "Select a color system",
                copyColorToClipboard: "Copy color to clipboard",
                extensionName: "Color Converter",
            },
            "de-CH": {
                colorSystem: "Farbsystem",
                selectAColorSystem: "Wähle ein Farbsystem",
                copyColorToClipboard: "Farbe in die Zwischenablage kopieren",
                extensionName: "Farbkonverter",
            },
        };
    }

    public getInstantSearchResultItems(searchTerm: string): SearchResultItem[] {
        const color = this.extractColorFromSearchTerm(searchTerm);

        if (!color) {
            return [];
        }

        const convertedColors: { system: string; value: string }[] = [
            { system: "CMYK", value: color.cmyk().string() },
            { system: "HEX", value: color.hex() },
            { system: "HLS", value: color.hsl().string() },
            { system: "RGB", value: color.rgb().string() },
        ];

        return convertedColors
            .filter(({ system }) => this.getEnabledColorSystems().includes(system))
            .map(({ system, value }) => ({
                defaultAction: SearchResultItemActionUtility.createCopyToClipboardAction({
                    textToCopy: value,
                    description: "Copy color to clipboard",
                    descriptionTranslation: {
                        key: "copyColorToClipboard",
                        namespace: "extension[ColorConverter]",
                    },
                }),
                description: system,
                id: `color-${value}-${system}`,
                image: this.getImage(),
                name: value,
            }));
    }

    private getEnabledColorSystems(): string[] {
        return this.settingsManager.getValue(`extension[${this.id}].colorSystems`, this.defaultSettings.colorSystems);
    }

    private extractColorFromSearchTerm(searchTerm: string): Color | undefined {
        try {
            return Color(searchTerm);
        } catch (error) {
            return undefined;
        }
    }
}
