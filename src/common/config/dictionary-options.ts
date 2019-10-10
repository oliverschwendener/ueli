export interface DictionaryOptions {
    debounceDelay: number;
    isEnabled: boolean;
    minSearchTermLength: number;
    prefix: string;
}

export const defaultDictionaryOptions: DictionaryOptions = {
    debounceDelay: 250,
    isEnabled: true,
    minSearchTermLength: 3,
    prefix: "dict?",
};
