import type { InitOptions } from "i18next";

export const resources: InitOptions["resources"] = {
    "en-US": {
        translation: {
            "ueliCommand.description": "Ueli Command",
            "ueliCommand.openSettings": "Open Ueli settings",
            "ueliCommand.openExtensions": "Browse Ueli extensions",
            "ueliCommand.centerWindow": "Center Ueli window",
            "ueliCommand.quitUeli": "Quit Ueli",
        },
    },
    "de-CH": {
        translation: {
            "ueliCommand.description": "Ueli Befehl",
            "ueliCommand.openSettings": "Ueli-Einstellungen öffnen",
            "ueliCommand.openExtensions": "Ueli-Erweiterungen durchsuchen",
            "ueliCommand.centerWindow": "Ueli-Fenster zentrieren",
            "ueliCommand.quitUeli": "Ueli Beenden",
        },
    },
};
