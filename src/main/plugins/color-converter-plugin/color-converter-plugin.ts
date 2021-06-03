import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { ColorConverterOptions } from "../../../common/config/color-converter-options";
import { isValidColorCode } from "./color-converter-helpers";
import { SearchResultItem } from "../../../common/search-result-item";
import { TranslationSet } from "../../../common/translation/translation-set";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import color from "color";
import { defaultColorConverterIcon } from "../../../common/icon/default-icons";
import { IconType } from "../../../common/icon/icon-type";
import { replaceWhitespace } from "../../../common/helpers/string-helpers";

export class ColorConverterPlugin implements ExecutionPlugin {
    public pluginType = PluginType.ColorConverter;
    private config: ColorConverterOptions;
    private readonly clipboardCopier: (value: string) => Promise<void>;

    constructor(config: ColorConverterOptions, clipboardCopier: (value: string) => Promise<void>) {
        this.config = config;
        this.clipboardCopier = clipboardCopier;
    }

    public isValidUserInput(userInput: string, fallback?: boolean | undefined): boolean {
        return isValidColorCode(userInput);
    }
    public getSearchResults(userInput: string, fallback?: boolean | undefined): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            resolve(this.buildSearchResult(userInput));
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.clipboardCopier(searchResultItem.executionArgument);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve, reject) => {
            this.config = updatedConfig.colorConverterOptions;
            resolve();
        });
    }

    private buildSearchResult(value: string): SearchResultItem[] {
        const converted = color(replaceWhitespace(value.trim(), ""));
        const result: SearchResultItem[] = [];

        if (this.config.hexEnabled) {
            result.push(this.buildColorSearchResult("HEX", converted.hex().toString()));
        }

        if (this.config.rgbEnabled) {
            result.push(this.buildColorSearchResult("RGB", converted.rgb().toString()));
        }

        if (this.config.rgbaEnabled) {
            const rgbaString = `rgba(${converted.red()}, ${converted.green()}, ${converted.blue()}, ${converted.alpha()})`;
            result.push(this.buildColorSearchResult("RGBA", rgbaString));
        }

        if (this.config.hslEnabled) {
            result.push(this.buildColorSearchResult("HSL", converted.hsl().toString()));
        }

        return result;
    }

    private buildColorSearchResult(colorName: string, colorValue: string): SearchResultItem {
        return {
            description: colorName,
            executionArgument: colorValue,
            hideMainWindowAfterExecution: true,
            icon: this.config.showColorPreview
                ? {
                      parameter: colorValue,
                      type: IconType.Color,
                  }
                : defaultColorConverterIcon,
            name: colorValue,
            originPluginType: this.pluginType,
            searchable: [],
        };
    }
}
