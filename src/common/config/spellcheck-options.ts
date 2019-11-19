export interface SpellcheckOptions {
    debounceDelay: number;
    isEnabled: boolean;
    minSearchTermLength: number;
    prefix: string;
}

export const defaultSpellcheckOptions: SpellcheckOptions = {
    debounceDelay: 250,
    isEnabled: true,
    minSearchTermLength: 3,
    prefix: "!",
};
