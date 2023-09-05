import { getBrowserLanguage } from "./getBrowserLanguage";
import { supportedLanguages } from "./supportedLanguages";

export const getDefaultLanguage = () => {
    const browserLanguage = getBrowserLanguage();

    return supportedLanguages.map(({ locale }) => locale).includes(browserLanguage) ? browserLanguage : "en-US";
};
