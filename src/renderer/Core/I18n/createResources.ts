import type { Resources, Translations } from "@common/Core/Translator";
import type { InitOptions } from "i18next";

export const createResources = (
    namespacedResources: { namespace: string; resources: Resources<Translations> }[],
): InitOptions["resources"] => {
    const result: InitOptions["resources"] = {};

    for (const { namespace, resources } of namespacedResources) {
        for (const locale of Object.keys(resources)) {
            if (!Object.keys(result).includes(locale)) {
                result[locale] = {};
            }

            result[locale][namespace] = resources[locale];
        }
    }

    return result;
};
