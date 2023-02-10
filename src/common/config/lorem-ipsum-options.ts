export interface LoremIpsumOptions {
    isEnabled: boolean;
    prefix: string;
}

export const defaultLoremIpsumOptions: LoremIpsumOptions = {
    isEnabled: true,
    prefix: "lipsum",
};
