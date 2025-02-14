export type PasswordGeneratorSettings = {
    command: string;
    quantity: number;
    passwordLength: number;
    includeLowercaseCharacters: boolean;
    includeUppercaseCharacters: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    symbols: string;
    beginWithALetter: boolean;
    noSimilarCharacters: boolean;
    noDuplicateCharacters: boolean;
    noSequentialCharacters: boolean;
};
