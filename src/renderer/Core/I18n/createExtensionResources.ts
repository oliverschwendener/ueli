import type { Translations } from "@common/Core/Extension";
import type { InitOptions } from "i18next";

export const createResources = (
    resources: InitOptions["resources"],
    extensionTranslations: { extensionId: string; translations: Translations }[],
) => {
    resources = resources ?? {};

    for (const { extensionId, translations } of extensionTranslations) {
        for (const locale of Object.keys(translations)) {
            if (!Object.keys(resources).includes(locale)) {
                resources[locale] = {};
            }

            resources[locale][`extension[${extensionId}]`] = translations[locale];
        }
    }

    return resources;
};
