import type { ContextBridge } from "@common/Core";
import { use } from "i18next";
import { initReactI18next } from "react-i18next";
import { createResources } from "./createResources";
import { getCoreResources } from "./getCoreResources";
import { getExtensionResources } from "./getExtensionResources";

export const useI18n = ({ contextBridge }: { contextBridge: ContextBridge }) => {
    return use(initReactI18next).init({
        resources: createResources([
            ...getCoreResources(),
            ...getExtensionResources(contextBridge.getExtensionResources()),
        ]),
        lng: contextBridge.getSettingValue("general.language", "en-US"),
        fallbackLng: "en-US",
    });
};
