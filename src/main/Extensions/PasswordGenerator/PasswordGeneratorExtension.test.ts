import type { PasswordGeneratorSettings } from "@common/Extensions/PasswordGenerator";
import { PasswordGeneratorDefaultSymbols } from "@common/Extensions/PasswordGenerator";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { SettingsManager } from "@Core/SettingsManager";
import { describe, expect, it, vi } from "vitest";
import { PasswordGeneratorExtension } from "./PasswordGeneratorExtension";

describe(PasswordGeneratorExtension, () => {
    describe(PasswordGeneratorExtension.prototype.getInstantSearchResultItems, () => {
        const imageFilePath = "/path/to/image";
        const getExtensionAssetPathMock = vi.fn().mockReturnValue(imageFilePath);

        const assetPathResolver = <AssetPathResolver>{
            getExtensionAssetPath: (i, f) => getExtensionAssetPathMock(i, f),
        };

        const validateSymbols = (password: string, settings: PasswordGeneratorSettings): boolean => {
            const symbolsOnly = password.replace(/abcdefghijklmnopqrstuvwxyz0123456789/gi, "");
            if (settings.includeSymbols === false && symbolsOnly.length > 0) {
                return false;
            }

            Array.from(symbolsOnly).forEach((symbol) => {
                if (settings.symbols.indexOf(symbol) < 0) {
                    return false;
                }
            });

            return true;
        };

        const validateDuplicateCharacters = (password: string): boolean => {
            const characterSet = new Set<string>();
            for (const character of password) {
                if (characterSet.has(character)) {
                    return true;
                }

                characterSet.add(character);
            }

            return false;
        };

        const validateSequentialCharacters = (password: string): boolean => {
            let previousCharacter = "";
            for (const character of password) {
                if (
                    previousCharacter.charCodeAt(0) + 1 === character.charCodeAt(0) ||
                    previousCharacter.charCodeAt(0) - 1 === character.charCodeAt(0)
                ) {
                    return true;
                }

                previousCharacter = character;
            }

            return false;
        };

        const validatePasswords = (passwords: string[], settings: PasswordGeneratorSettings): boolean => {
            if (passwords.length !== settings.quantity) {
                return false;
            }

            passwords.forEach((password) => {
                if (password.length !== settings.passwordLength) {
                    return false;
                }

                if (
                    settings.includeUppercaseCharacters === false &&
                    /ABCDEFGHIJKLMNOPQRSTUVWXYZ/g.test(password) === true
                ) {
                    return false;
                }

                if (
                    settings.includeLowercaseCharacters === false &&
                    /abcdefghijklmnopqrstuvwxyz/g.test(password) === true
                ) {
                    return false;
                }

                if (settings.includeNumbers === false && /0123456789/g.test(password) === true) {
                    return false;
                }

                if (validateSymbols(password, settings) === false) {
                    return false;
                }

                if (
                    settings.beginWithALetter === true &&
                    /abcdefghijklmnopqrstuvwxyz/gi.test(password.charAt(0)) === false
                ) {
                    return false;
                }

                if (settings.noSimilarCharacters === true && /[01ilo|]/gi.test(password) === true) {
                    return false;
                }

                if (settings.noDuplicateCharacters === true && validateDuplicateCharacters(password) === true) {
                    return false;
                }

                if (settings.noSequentialCharacters === true && validateSequentialCharacters(password) === true) {
                    return false;
                }
            });

            return true;
        };

        it.each([
            [
                <PasswordGeneratorSettings>{
                    command: "pw",
                    quantity: 100,
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
                },
            ],
            [
                <PasswordGeneratorSettings>{
                    command: "pw",
                    quantity: 100,
                    passwordLength: 24,
                    includeUppercaseCharacters: true,
                    includeLowercaseCharacters: true,
                    includeNumbers: true,
                    includeSymbols: true,
                    symbols: PasswordGeneratorDefaultSymbols,
                    beginWithALetter: true,
                    noSimilarCharacters: true,
                    noDuplicateCharacters: false,
                    noSequentialCharacters: false,
                },
            ],
            [
                <PasswordGeneratorSettings>{
                    command: "pw",
                    quantity: 100,
                    passwordLength: 24,
                    includeUppercaseCharacters: true,
                    includeLowercaseCharacters: true,
                    includeNumbers: true,
                    includeSymbols: true,
                    symbols: PasswordGeneratorDefaultSymbols,
                    beginWithALetter: true,
                    noSimilarCharacters: false,
                    noDuplicateCharacters: true,
                    noSequentialCharacters: false,
                },
            ],
            [
                <PasswordGeneratorSettings>{
                    command: "pw",
                    quantity: 100,
                    passwordLength: 24,
                    includeUppercaseCharacters: true,
                    includeLowercaseCharacters: true,
                    includeNumbers: true,
                    includeSymbols: true,
                    symbols: PasswordGeneratorDefaultSymbols,
                    beginWithALetter: false,
                    noSimilarCharacters: false,
                    noDuplicateCharacters: false,
                    noSequentialCharacters: true,
                },
            ],
            [
                <PasswordGeneratorSettings>{
                    command: "pw",
                    quantity: 100,
                    passwordLength: 24,
                    includeUppercaseCharacters: false,
                    includeLowercaseCharacters: false,
                    includeNumbers: false,
                    includeSymbols: true,
                    symbols: "+-*/",
                    beginWithALetter: false,
                    noSimilarCharacters: false,
                    noDuplicateCharacters: false,
                    noSequentialCharacters: false,
                },
            ],
        ])("passwords should be valid compared to the settings", (settings) => {
            const getValueMock = vi.fn().mockImplementation((k) => {
                switch (k) {
                    case "extension[PasswordGenerator].command":
                        return settings.command;
                    case "extension[PasswordGenerator].quantity":
                        return settings.quantity;
                    case "extension[PasswordGenerator].passwordLength":
                        return settings.passwordLength;
                    case "extension[PasswordGenerator].includeUppercaseCharacters":
                        return settings.includeUppercaseCharacters;
                    case "extension[PasswordGenerator].includeLowercaseCharacters":
                        return settings.includeLowercaseCharacters;
                    case "extension[PasswordGenerator].includeNumbers":
                        return settings.includeNumbers;
                    case "extension[PasswordGenerator].includeSymbols":
                        return settings.includeSymbols;
                    case "extension[PasswordGenerator].symbols":
                        return settings.symbols;
                    case "extension[PasswordGenerator].beginWithALetter":
                        return settings.beginWithALetter;
                    case "extension[PasswordGenerator].noSimilarCharacters":
                        return settings.noSimilarCharacters;
                    case "extension[PasswordGenerator].noDuplicateCharacters":
                        return settings.noDuplicateCharacters;
                    case "extension[PasswordGenerator].noSequentialCharacters":
                        return settings.noSequentialCharacters;
                }
            });
            const settingsManager = <SettingsManager>{
                getValue: (k, d) => getValueMock(k, d),
            };

            const passwordGenerator = new PasswordGeneratorExtension(assetPathResolver, settingsManager);

            expect(
                validatePasswords(
                    passwordGenerator.getInstantSearchResultItems(settings.command).before.map((result) => result.name),
                    settings,
                ),
            ).toEqual(true);
        });
    });
});
