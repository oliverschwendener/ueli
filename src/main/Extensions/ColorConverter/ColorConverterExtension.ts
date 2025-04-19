import { createCopyToClipboardAction, type InstantSearchResultItems, type SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { Resources, Translations } from "@common/Core/Translator";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { ColorConverter } from "./ColorConverter";
import type { ColorPreviewGenerator } from "./ColorPreviewGenerator";
import type { Settings } from "./Settings";

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

    private readonly defaultSettings: Settings = {
        formats: ["HEX", "HSL", "RGB"],
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly translator: Translator,
        private readonly colorConverter: ColorConverter,
        private readonly colorPreviewGenerator: ColorPreviewGenerator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue(key: keyof Settings) {
        return this.defaultSettings[key];
    }

    public getI18nResources(): Resources<Translations> {
        return {
            "en-US": {
                formats: "Color Formats",
                selectAColorFormat: "Select a color format",
                color: "{{ format }} Color",
                copyColorToClipboard: "Copy color to clipboard",
                extensionName: "Color Converter",
            },
            "de-CH": {
                formats: "Farbformate",
                selectAColorFormat: "Wähle ein Farbformat",
                color: "{{ format }} Farbe",
                copyColorToClipboard: "Farbe in die Zwischenablage kopieren",
                extensionName: "Farbkonverter",
            },
            "ja-JP": {
                formats: "フォーマット",
                selectAColorFormat: "色コードを選択",
                color: "{{ format }} Color",
                copyColorToClipboard: "色コードをクリップボードにコピー",
                extensionName: "色コード変換",
            },
            "ko-KR": {
                formats: "색상 포맷",
                selectAColorFormat: "색상 포맷 선택",
                color: "{{ format }} 색상",
                copyColorToClipboard: "색상 포맷을 클립보드에 복사",
                extensionName: "색상 변환기",
            },
        };
    }

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        const { t } = this.translator.createT(this.getI18nResources());

        return {
            after: this.colorConverter
                .convertFromString(searchTerm)
                .filter(({ format }) => this.getEnabledColorFormats().includes(format))
                .map(({ format, value, name: details }) => {
                    const hexColor = this.colorConverter.getRgbColor(value);

                    return {
                        defaultAction: createCopyToClipboardAction({
                            textToCopy: value,
                            description: "Copy color to clipboard",
                            descriptionTranslation: {
                                key: "copyColorToClipboard",
                                namespace: "extension[ColorConverter]",
                            },
                        }),
                        description: t("color", { format }),
                        details,
                        id: `color-${value}-${format}`,
                        image: hexColor ? this.getColorImage(hexColor) : this.getImage(),
                        name: value,
                    };
                }),
            before: [],
        };
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "color-converter.png")}`,
        };
    }

    private getColorImage(hexColor: string): Image {
        return {
            url: this.colorPreviewGenerator.generateImageUrl(hexColor),
        };
    }

    private getEnabledColorFormats(): string[] {
        return this.settingsManager.getValue(`extension[${this.id}].formats`, this.defaultSettings.formats);
    }
}
