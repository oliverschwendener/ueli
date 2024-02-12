import type { Translations } from "@common/Core/Extension";
import type { InitOptions } from "i18next";

export const createResources = (
    namespacedTranslations: { namespace: string; translations: Translations }[],
): InitOptions["resources"] => {
    const resources: InitOptions["resources"] = {};

    for (const { namespace, translations } of namespacedTranslations) {
        for (const locale of Object.keys(translations)) {
            if (!Object.keys(resources).includes(locale)) {
                resources[locale] = {};
            }

            resources[locale][namespace] = translations[locale];
        }
    }

    return resources;
};
