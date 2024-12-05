import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import {
    createCopyToClipboardAction,
    createEmptyInstantSearchResult,
    type InstantSearchResultItems,
    type SearchResultItem,
} from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import { Calculator } from "./Calculator";

type Settings = {
    precision: number;
    decimalSeparator: string;
    argumentSeparator: string;
};

export class CalculatorExtension implements Extension {
    public readonly id = "Calculator";
    public readonly name = "Calculator";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[Calculator]",
    };

    private readonly defaultSettings: Settings = {
        precision: 8,
        decimalSeparator: ".",
        argumentSeparator: ",",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
    ) {}

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        const result = this.getResultForExpression(searchTerm);

        if (result === undefined) {
            return createEmptyInstantSearchResult();
        }

        return {
            after: [
                {
                    name: result,
                    description: "Calculator",
                    descriptionTranslation: {
                        key: "calculatorResult",
                        namespace: "extension[Calculator]",
                    },
                    id: "calculator:instantResult",
                    image: this.getImage(),
                    defaultAction: createCopyToClipboardAction({
                        textToCopy: result,
                        description: "Copy result to clipboard",
                        descriptionTranslation: {
                            key: "copyResultToClipboard",
                            namespace: "extension[Calculator]",
                        },
                    }),
                },
            ],
            before: [],
        };
    }

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue(key: keyof Settings) {
        return this.defaultSettings[key];
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "calculator.png")}`,
        };
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [];
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Calculator",
                calculatorResult: "Calculation Result",
                copyResultToClipboard: "Copy result to clipboard",
                precision: "Precision",
                decimalSeparator: "Decimal Separator",
                argumentSeparator: "Argument Separator",
            },
            "de-CH": {
                extensionName: "Rechner",
                calculatorResult: "Rechnungsresultat",
                copyResultToClipboard: "Resultat in Zwischenablage kopieren",
                precision: "Präzision",
                decimalSeparator: "Dezimaltrennzeichen",
                argumentSeparator: "Argumententrennzeichen",
            },
        };
    }

    private getResultForExpression(expression: string): string | undefined {
        const precision = this.getSettingValue<number>("precision");
        const decimalSeparator = this.getSettingValue<string>("decimalSeparator");
        const argumentSeparator = this.getSettingValue<string>("argumentSeparator");

        return Calculator.isValidExpression({ expression, decimalSeparator, argumentSeparator })
            ? Calculator.calculate({ expression, argumentSeparator, decimalSeparator, precision })
            : undefined;
    }

    private getSettingValue<T>(key: keyof Settings): T {
        return this.settingsManager.getValue<T>(
            getExtensionSettingKey(this.id, key),
            <T>this.getSettingDefaultValue(key),
        );
    }
}
