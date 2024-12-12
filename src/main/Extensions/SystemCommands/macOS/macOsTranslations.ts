import type { Resources } from "@common/Core/Translator";

export type MacOsTranslations = {
    extensionName: string;
    searchResultItemDescription: string;
    shutdown: string;
    restart: string;
    logOut: string;
    sleep: string;
    lock: string;
    emptyTrash: string;
};

export const macOsResources: Resources<MacOsTranslations> = {
    "en-US": {
        extensionName: "System Commands",
        searchResultItemDescription: "System Command",
        shutdown: "Shutdown",
        restart: "Restart...",
        logOut: "Log Out",
        sleep: "Sleep",
        lock: "Lock",
        emptyTrash: "Empty recycle bin",
    },
    "de-CH": {
        extensionName: "Systembefehle",
        searchResultItemDescription: "Systembefehl",
        shutdown: "Herunterfahren",
        restart: "Neustarten...",
        logOut: "Ausloggen",
        sleep: "Energiesparmodus",
        lock: "Sperren",
        emptyTrash: "Papierkorb leeren",
    },
};
