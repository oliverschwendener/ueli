import type { ContextBridge } from "@common/Core";
import { use } from "i18next";
import { initReactI18next } from "react-i18next";
import { createResources } from "./createResources";
import { getCoreTranslations } from "./getCoreTranslations";
import { getExtensionTranslations } from "./getExtensionTranslations";

export const useI18n = ({ contextBridge }: { contextBridge: ContextBridge }) => {
    return use(initReactI18next).init({
        resources: createResources([
            ...getCoreTranslations(),
            ...getExtensionTranslations(contextBridge.getExtensionTranslations()),
        ]),
        lng: contextBridge.getSettingValue("general.language", "en-US"),
        fallbackLng: "en-US",
    });
};
