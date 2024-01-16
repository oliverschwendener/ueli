import type { InitOptions } from "i18next";

export const resources: InitOptions["resources"] = {
    "en-US": {
        translation: {
            "searchResultItem.description": "Translate with DeepL",
            "searchResultItem.name": "DeepL Translator",
            "searchResultItem.actionDescription": "Open DeepL Translator",
        },
    },
    "de-CH": {
        translation: {
            "searchResultItem.description": "Mit DeepL übersetzen",
            "searchResultItem.name": "DeepL Übersetzer",
            "searchResultItem.actionDescription": "DeepL Übersetzer öffnen",
        },
    },
};
