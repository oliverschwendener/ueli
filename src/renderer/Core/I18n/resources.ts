import type { InitOptions } from "i18next";
import * as Core from "./Core";

export const resources: InitOptions["resources"] = {
    "en-US": {
        general: Core.general["en-US"],
        search: Core.search["en-US"],
        settingsGeneral: Core.settingsGeneral["en-US"],
        settingsAppearance: Core.settingsAppearance["en-US"],
        settingsDebug: Core.settingsDebug["en-US"],
        settingsAbout: Core.settingsAbout["en-US"],
        settingsExtensions: Core.settingsExtensions["en-US"],
        settingsSearchEngine: Core.settingsSearchEngine["en-US"],
        settingsFavorites: Core.settingsFavorites["en-US"],
        settingsWindow: Core.settingsWindow["en-US"],
        searchResultItemAction: Core.searchResultItemAction["en-US"],
    },
    "de-CH": {
        general: Core.general["de-CH"],
        search: Core.search["de-CH"],
        settingsGeneral: Core.settingsGeneral["de-CH"],
        settingsAppearance: Core.settingsAppearance["de-CH"],
        settingsDebug: Core.settingsDebug["de-CH"],
        settingsAbout: Core.settingsAbout["de-CH"],
        settingsExtensions: Core.settingsExtensions["de-CH"],
        settingsSearchEngine: Core.settingsSearchEngine["de-CH"],
        settingsFavorites: Core.settingsFavorites["de-CH"],
        settingsWindow: Core.settingsWindow["de-CH"],
        searchResultItemAction: Core.searchResultItemAction["de-CH"],
    },
};
