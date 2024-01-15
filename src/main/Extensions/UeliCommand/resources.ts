import type { InitOptions } from "i18next";

export const resources: InitOptions["resources"] = {
    "en-US": {
        translation: {
            "ueliCommand.description": "Ueli Command",
            "ueliCommand.openSettings": "Open Ueli settings",
            "ueliCommand.openExtensions": "Browse Ueli extensions",
            "ueliCommand.quitUeli": "Quit Ueli",
        },
    },
    "de-CH": {
        translation: {
            "ueliCommand.description": "Ueli Befehl",
            "ueliCommand.openSettings": "Ueli-Einstellungen öffnen",
            "ueliCommand.openExtensions": "Ueli-Erweiterungen durchsuchen",
            "ueliCommand.quitUeli": "Ueli Beenden",
        },
    },
};
