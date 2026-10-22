import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { createResources } from "./createResources";
import { getCoreResources } from "./getCoreResources";
import { getExtensionResources } from "./getExtensionResources";

i18n.use(initReactI18next).init({
    resources: createResources([
        ...getCoreResources(),
        ...getExtensionResources(window.ContextBridge.getExtensionResources()),
    ]),
    lng: window.ContextBridge.getSettingValue("general.language", "en-US"),
    fallbackLng: "en-US",
});

export default i18n;
