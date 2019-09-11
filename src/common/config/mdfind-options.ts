export interface MdFindOptions {
    enabled: boolean;
    prefix: string;
    maxSearchResults: number;
    debounceDelay: number;
}

export const defaultMdfindOptions: MdFindOptions = {
    debounceDelay: 250,
    enabled: false,
    maxSearchResults: 24,
    prefix: "md?",
};
