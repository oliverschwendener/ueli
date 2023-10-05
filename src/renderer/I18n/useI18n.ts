import type { ContextBridge } from "@common/ContextBridge";
import { use } from "i18next";
import { initReactI18next } from "react-i18next";
import { getDefaultLanguage } from "./getDefaultLanguage";
import { resources } from "./resources";

export const useI18n = ({ contextBridge }: { contextBridge: ContextBridge }) => {
    use(initReactI18next).init({
        resources,
        lng: contextBridge.getSettingByKey("general.language", getDefaultLanguage()),
        fallbackLng: "en-US",
    });
};
