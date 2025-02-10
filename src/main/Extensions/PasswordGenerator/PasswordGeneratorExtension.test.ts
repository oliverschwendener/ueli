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

                if (settings.noDuplicateCharacters === true) {
                    // TODO
                    return false;
                }

                if (settings.noSequentialCharacters === true) {
                    // TODO
                    return false;
                }
            });

            return true;
        };

        it.each([
            [
                <PasswordGeneratorSettings>{
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
                },
            ],
        ])("passwords should be valid compared to the settings", (settings) => {
            const getValueMock = vi.fn().mockReturnValue(settings);
            const settingsManager = <SettingsManager>{
                getValue: (k, d, s) => getValueMock(k, d, s),
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
