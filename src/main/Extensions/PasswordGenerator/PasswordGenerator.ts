import type { PasswordGeneratorSettings } from "@common/Extensions/PasswordGenerator";

export class PasswordGenerator {
    public static generatePassword(settings: PasswordGeneratorSettings): string {
        const charset = this.determineCharset(settings);

        let password = "";
        let previousCharacter = "";

        for (let index = 0; index < settings.passwordLength; index++) {
            let nextCharacter = "";
            let isValid = false;

            while (isValid === false) {
                isValid = true;
                nextCharacter = this.pickCharacter(
                    index === 0 && settings.beginWithALetter ? charset.letterCharset : charset.completeCharset,
                );

                if (
                    settings.noSequentialCharacters === true &&
                    (previousCharacter.charCodeAt(0) + 1 === nextCharacter.charCodeAt(0) ||
                        previousCharacter.charCodeAt(0) - 1 === nextCharacter.charCodeAt(0))
                ) {
                    isValid = false;
                }

                if (isValid === true && settings.noDuplicateCharacters === true) {
                    charset.letterCharset = charset.letterCharset.replace(nextCharacter, "");
                    charset.completeCharset = charset.completeCharset.replace(nextCharacter, "");
                }
            }

            previousCharacter = nextCharacter;
            password += nextCharacter;
        }

        return password;
    }

    private static pickCharacter(charset: string) {
        const randomBuffer = new Uint32Array(1);
        crypto.getRandomValues(randomBuffer);

        let randomNumber = randomBuffer[0] / (0xffffffff + 1);
        randomNumber = Math.floor(randomNumber * (charset.length + 1));
        return charset.charAt(randomNumber);
    }

    private static determineCharset(settings: PasswordGeneratorSettings): {
        completeCharset: string;
        letterCharset: string;
    } {
        const uppercaseCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseCharacters = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = settings.symbols;

        let charset: string = "";
        let letterCharset: string = "";

        if (settings.includeUppercaseCharacters === true) {
            charset += uppercaseCharacters;
            letterCharset += uppercaseCharacters;
        }

        if (settings.includeLowercaseCharacters === true) {
            charset += lowercaseCharacters;
            letterCharset += lowercaseCharacters;
        }

        if (settings.includeNumbers === true) {
            charset += numbers;
        }

        if (settings.includeSymbols === true) {
            charset += symbols;
        }

        if (settings.noSimilarCharacters === true) {
            charset = charset.replace(/[01ilo|]/gi, "");
            letterCharset = letterCharset.replace(/[01ilo|]*/gi, "");
        }

        return { completeCharset: charset, letterCharset: letterCharset };
    }
}
