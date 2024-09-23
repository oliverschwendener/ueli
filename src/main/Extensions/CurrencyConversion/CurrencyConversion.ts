import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Net } from "electron";
import { convert } from "./convert";
import type { Rates } from "./Rates";

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

    private readonly defaultSettings = {
        currencies: ["usd", "chf", "eur"],
    };

    private rates: Rates;

    public constructor(
        private readonly settingsManager: SettingsManager,
        private readonly net: Net,
        private readonly assetPathResolver: AssetPathResolver,
    ) {
        this.rates = {};
    }

    public getInstantSearchResultItems(searchTerm: string): SearchResultItem[] {
        const parts = searchTerm.trim().split(" ");

        const validators = [
            () => parts.length === 4,
            () => !isNaN(Number(parts[0])),
            () => Object.keys(this.rates).includes(parts[1].toLowerCase()),
            () => ["in", "to"].includes(parts[2].toLowerCase()),
            () => Object.keys(this.rates[parts[1].toLowerCase()]).includes(parts[3].toLowerCase()),
        ];

        for (const validator of validators) {
            if (!validator()) {
                return [];
            }
        }

        const value = Number(parts[0]);
        const base = parts[1];
        const target = parts[3];

        const conversionResult = convert({ value, base, target, rates: this.rates });

        return [
            {
                defaultAction: SearchResultItemActionUtility.createCopyToClipboardAction({
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
                name: `${conversionResult.result.toFixed(2)} ${parts[3].toUpperCase()}`,
            },
        ];
    }

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        await this.setRates();
        return [];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(key: string): T {
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
                selectCurrencies: "Select currencies",
                copyToClipboard: "Copy to clipboard",
                currencyConversion: "Currency Conversion",
            },
            "de-CH": {
                extensionName: "Währungsumrechnung",
                currencies: "Währungen",
                selectCurrencies: "Währungen wählen",
                copyToClipboard: "In Zwischenablage kopieren",
                currencyConversion: "Währungsumrechnung",
            },
        };
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [getExtensionSettingKey(this.id, "currencies")];
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
}
