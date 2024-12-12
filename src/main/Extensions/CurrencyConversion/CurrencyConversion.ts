import {
    createCopyToClipboardAction,
    createEmptyInstantSearchResult,
    type InstantSearchResultItems,
    type SearchResultItem,
} from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Net } from "electron";
import { convert } from "./convert";
import type { Rates } from "./Rates";
import type { Settings } from "./Settings";

export class CurrencyConversion implements Extension {
    private static readonly translationNamespace = "extension[CurrencyConversion]";

    public readonly id = "CurrencyConversion";
    public readonly name = "Currency Conversion";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: CurrencyConversion.translationNamespace,
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    private readonly defaultSettings: Settings = {
        currencies: ["usd", "chf", "eur"],
        defaultTargetCurrency: "eur",
    };

    // This property is not read-only by intention, so it can be easily set for tests
    private rates: Rates = {};

    public constructor(
        private readonly settingsManager: SettingsManager,
        private readonly net: Net,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        const parts = searchTerm.trim().split(" ");

        const validators = [
            () => parts.length === 2 || parts.length === 4,
            () => !isNaN(Number(parts[0])),
            () => Object.keys(this.rates).includes(parts[1].toLowerCase()),
            () => parts.length === 2 || (parts.length === 4 && ["in", "to"].includes(parts[2].toLowerCase())),
            () =>
                Object.keys(this.rates[parts[1].toLowerCase()]).includes(
                    parts.length === 4 ? parts[3].toLowerCase() : this.getDefaultTargetCurrency(),
                ),
        ];

        for (const validator of validators) {
            if (!validator()) {
                return createEmptyInstantSearchResult();
            }
        }

        const value = Number(parts[0]);
        const base = parts[1];
        const target = parts.length === 4 ? parts[3].toLowerCase() : this.getDefaultTargetCurrency();

        const conversionResult = convert({ value, base, target, rates: this.rates });

        return {
            after: [],
            before: [
                {
                    defaultAction: createCopyToClipboardAction({
                        textToCopy: conversionResult.result.toFixed(2),
                        description: "Currency Conversion",
                        descriptionTranslation: {
                            key: "copyToClipboard",
                            namespace: CurrencyConversion.translationNamespace,
                        },
                    }),
                    description: "Currency Conversion",
                    descriptionTranslation: {
                        key: "currencyConversion",
                        namespace: CurrencyConversion.translationNamespace,
                    },
                    id: `currency-conversion:instant-result`,
                    image: this.getImage(),
                    name: `${conversionResult.result.toFixed(2)} ${target.toUpperCase()}`,
                },
            ],
        };
    }

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        await this.setRates();
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
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "currency-conversion.png")}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Currency Conversion",
                currencies: "Currencies",
                defaultTargetCurrency: "Default Target Currency",
                selectCurrencies: "Select currencies",
                copyToClipboard: "Copy to clipboard",
                currencyConversion: "Currency Conversion",
            },
            "de-CH": {
                extensionName: "Währungsumrechnung",
                currencies: "Währungen",
                defaultTargetCurrency: "Standard-Zielwährung",
                selectCurrencies: "Währungen wählen",
                copyToClipboard: "In Zwischenablage kopieren",
                currencyConversion: "Währungsumrechnung",
            },
        };
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [
            getExtensionSettingKey(this.id, "currencies"),
            getExtensionSettingKey(this.id, "defaultTargetCurrency"),
        ];
    }

    private async setRates(): Promise<void> {
        const currencies = this.settingsManager.getValue(
            getExtensionSettingKey(this.id, "currencies"),
            this.defaultSettings.currencies,
        );

        await Promise.allSettled(currencies.map((currency) => this.setRate(currency)));
    }

    private async setRate(currency: string): Promise<void> {
        const response = await this.net.fetch(
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`,
        );

        const responseJson = await response.json();

        this.rates[currency] = responseJson[currency];
    }

    private getDefaultTargetCurrency(): string {
        return this.settingsManager.getValue<string>(
            getExtensionSettingKey(this.id, "defaultTargetCurrency"),
            <string>this.getSettingDefaultValue("defaultTargetCurrency"),
        );
    }
}
