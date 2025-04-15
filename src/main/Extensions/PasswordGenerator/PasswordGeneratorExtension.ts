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
import type { PasswordGeneratorSettings as Settings } from "@common/Extensions/PasswordGenerator";
import { PasswordGeneratorDefaultSymbols } from "@common/Extensions/PasswordGenerator";
import { PasswordGenerator } from "./PasswordGenerator";

export class PasswordGeneratorExtension implements Extension {
    public readonly id = "PasswordGenerator";
    public readonly name = "Password Generator";

    public readonly defaultSettings: Settings = {
        command: "pw",
        quantity: 5,
        passwordLength: 24,
        includeUppercaseCharacters: true,
        includeLowercaseCharacters: true,
        includeNumbers: true,
        includeSymbols: true,
        symbols: PasswordGeneratorDefaultSymbols,
        beginWithALetter: false,
        noSimilarCharacters: false,
        noDuplicateCharacters: false,
        noSequentialCharacters: false,
    };

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[PasswordGenerator]",
    };

    public readonly author = {
        name: "Marco Senn-Haag",
        githubUserName: "MarcoSennHaag",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
    ) {}

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T extends keyof Settings>(key: T): Settings[T] {
        return this.defaultSettings[key];
    }

    private getSettingValue<T extends keyof Settings>(key: T): Settings[T] {
        return this.settingsManager.getValue(getExtensionSettingKey(this.id, key), this.getSettingDefaultValue(key));
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "password-generator.png")}`,
        };
    }

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        // The password generator does not have static search results
        return [];
    }

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        const command = this.getSettingValue("command");

        if (![command].includes(searchTerm.toLowerCase())) {
            return createEmptyInstantSearchResult();
        }

        const quantity = this.getSettingValue("quantity");
        const passwords = Array.from({ length: quantity }, () => this.generatePassword());

        return {
            after: [],
            before: passwords.map((password, index) => {
                return {
                    name: password,
                    description: "Generated password",
                    descriptionTranslation: {
                        key: "generatorResult",
                        namespace: "extension[PasswordGenerator]",
                    },
                    id: "passwordGenerator:instantResult-" + index,
                    image: this.getImage(),
                    defaultAction: createCopyToClipboardAction({
                        textToCopy: password,
                        description: "Copy password to clipboard",
                        descriptionTranslation: {
                            key: "copyPasswordToClipboard",
                            namespace: "extension[PasswordGenerator]",
                        },
                    }),
                };
            }),
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Password Generator",
                command: "Command to generate passwords",
                quantity: "Amount of passwords to generate",
                passwordLength: "Length of the passwords",
                includeUppercaseCharacters: "Include uppercase characters",
                includeLowercaseCharacters: "Include lowercase characters",
                includeNumbers: "Include numbers",
                includeSymbols: "Include symbols",
                beginWithALetter: "Begin with a letter",
                noSimilarCharacters: "Don't use similar characters (e.g. i, l, 1, L, o, 0, O, ...)",
                noDuplicateCharacters: "Don't use characters more than once",
                noSequentialCharacters: "Don't use characters in sequence (e.g. abc, 123, ...)",
                resetSymbols: "Reset",
                generatorResult: "Generated password",
                copyPasswordToClipboard: "Copy password to clipboard",
            },
            "de-CH": {
                extensionName: "Passwort Generator",
                command: "Eingabe, um Passworte zu generieren",
                quantity: "Anzahl zu generierende Passworte",
                passwordLength: "Länge der Passworte",
                includeUppercaseCharacters: "Verwende Grossbuchstaben",
                includeLowercaseCharacters: "Verwende Kleinbuchstaben",
                includeNumbers: "Verwende Zahlen",
                includeSymbols: "Verwende Symbole",
                beginWithALetter: "Starte Passwort mit einem Buchstaben",
                noSimilarCharacters: "Verwende keine ähnlichen Zeichen (z.B. i, l, 1, L, o, 0, O, ...)",
                noDuplicateCharacters: "Verwende keine Zeichen mehrfach",
                noSequentialCharacters: "Verwende keine aufeinanderfolgende Zeichen (z.B. abc, 123, ...)",
                resetSymbols: "Zurücksetzen",
                generatorResult: "Generiertes Passwort",
                copyPasswordToClipboard: "Passwort in die Zwischenablage kopieren",
            },
            "ja-JP": {
                extensionName: "パスワード生成",
                command: "パスワードを生成するコマンド",
                quantity: "生成するパスワードの数量",
                passwordLength: "文字列長",
                includeUppercaseCharacters: "英大文字を含む",
                includeLowercaseCharacters: "英小文字を含む",
                includeNumbers: "数字を含む",
                includeSymbols: "記号を含む",
                beginWithALetter: "先頭は文字から",
                noSimilarCharacters: "似ている英数字は使わない(例：i, l, 1, L, o, 0, O, ...)",
                noDuplicateCharacters: "重複する文字は使わない",
                noSequentialCharacters: "単純な並びの文字は使わない(例：abc, 123, ...)",
                resetSymbols: "リセット",
                generatorResult: "パスワードを生成",
                copyPasswordToClipboard: "パスワードをクリップボードにコピー",
            },
        };
    }

    private generatePassword(): string {
        return PasswordGenerator.generatePassword(<Settings>{
            command: this.getSettingValue("command"),
            quantity: this.getSettingValue("quantity"),
            passwordLength: this.getSettingValue("passwordLength"),
            includeUppercaseCharacters: this.getSettingValue("includeUppercaseCharacters"),
            includeLowercaseCharacters: this.getSettingValue("includeLowercaseCharacters"),
            includeNumbers: this.getSettingValue("includeNumbers"),
            includeSymbols: this.getSettingValue("includeSymbols"),
            symbols: this.getSettingValue("symbols"),
            beginWithALetter: this.getSettingValue("beginWithALetter"),
            noSimilarCharacters: this.getSettingValue("noSimilarCharacters"),
            noDuplicateCharacters: this.getSettingValue("noDuplicateCharacters"),
            noSequentialCharacters: this.getSettingValue("noSequentialCharacters"),
        });
    }
}
