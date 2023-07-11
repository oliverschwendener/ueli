export interface LoremIpsumOptions {
    isEnabled: boolean;
    prefix: string;
}

export const defaultLoremIpsumOptions: LoremIpsumOptions = {
    isEnabled: false,
    prefix: "lipsum",
};
