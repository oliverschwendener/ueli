import type { Resources } from "@common/Core/Translator";

export type LinuxTranslations = {
    extensionName: string;
    searchResultItemDescription: string;
    emptyTrash: string;
};

export const linuxResources: Resources<LinuxTranslations> = {
    "en-US": {
        extensionName: "System Commands",
        searchResultItemDescription: "System Command",
        emptyTrash: "Empty recycle bin",
    },
    "de-CH": {
        extensionName: "Systembefehle",
        searchResultItemDescription: "Systembefehl",
        emptyTrash: "Papierkorb leeren",
    },
};
