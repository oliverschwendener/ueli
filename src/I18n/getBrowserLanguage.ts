export const getBrowserLanguage = (): string => {
    if (navigator.languages && navigator.languages[0]) {
        return navigator.languages[0];
    }

    return navigator.language;
};
