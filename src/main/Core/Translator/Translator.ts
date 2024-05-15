import type { Translations } from "@common/Core/Extension";
import type { SettingsManager } from "@Core/SettingsManager";
import { createInstance, type i18n, type InitOptions } from "i18next";
import type { Translator as TranslatorInterface } from "./Contract";

export class Translator implements TranslatorInterface {
    public constructor(private readonly settingsManager: SettingsManager) {}

    public createInstance(translations: Translations): i18n {
        const instance = createInstance({
            initImmediate: false, // Is needed for synchronous initialization
            resources: this.createResources(translations),
            lng: this.settingsManager.getValue("general.language", "en-US"),
        });

        instance.init();

        return instance;
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
