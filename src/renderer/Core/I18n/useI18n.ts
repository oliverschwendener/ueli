import { use } from "i18next";
import { initReactI18next } from "react-i18next";

import { createResources } from "./createResources";
import { getCoreResources } from "./getCoreResources";
import { getExtensionResources } from "./getExtensionResources";

// i18next must only be initialized once per window: calling init() again on every render re-triggers every
// useTranslation() consumer mid-render and makes the Settings window re-render hundreds of times.
let isInitialized = false;

export const useI18n = () => {
    if (isInitialized) {
        return;
    }

    isInitialized = true;

    return use(initReactI18next).init({
        resources: createResources([
            ...getCoreResources(),
            ...getExtensionResources(window.ContextBridge.getExtensionResources()),
        ]),
        lng: window.ContextBridge.getSettingValue("general.language", "en-US"),
        fallbackLng: "en-US",
    });
};
