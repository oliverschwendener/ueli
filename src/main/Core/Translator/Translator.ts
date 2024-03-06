import type { Translations } from "@common/Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import { createInstance, InitOptions, type TFunction } from "i18next";
import type { Translator as TranslatorInterface } from "./Contract";

export class Translator implements TranslatorInterface {
    public constructor(private readonly settingsManager: SettingsManager) {}

    public createInstance(translations: Translations): Promise<TFunction<"translation", undefined>> {
        return new Promise((resolve, reject) => {
            createInstance(
                {
                    resources: this.createResources(translations),
                    lng: this.settingsManager.getValue("general.language", "en-US"),
                },
                (error, t) => (error ? reject(error) : resolve(t)),
            );
        });
    }

    private createResources(translations: Translations): InitOptions["resources"] {
        const resources: InitOptions["resources"] = {};

        for (const locale of Object.keys(translations)) {
            resources[locale] = {
                translation: translations[locale],
            };
        }

        return resources;
    }
}
