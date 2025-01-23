import type { SettingsManager } from "@Core/SettingsManager";
import type { Resources, Translations } from "@common/Core/Translator";
import { createInstance, type InitOptions } from "i18next";
import type { TFunction, Translator as TranslatorInterface } from "./Contract";

export class Translator implements TranslatorInterface {
    public constructor(private readonly settingsManager: SettingsManager) {}

    public createT<T extends Translations>(resources: Resources<T>): { t: TFunction } {
        const instance = createInstance({
            initImmediate: false, // Is needed for synchronous initialization
            resources: this.createResources(resources),
            lng: this.settingsManager.getValue("general.language", "en-US"),
        });

        instance.init();

        return {
            t: (key: keyof T, interpolation?: Record<string, string>) => instance.t(key as string, interpolation),
        };
    }

    private createResources<T extends Translations>(translations: Resources<T>): InitOptions["resources"] {
        const resources: InitOptions["resources"] = {};

        for (const locale of Object.keys(translations)) {
            resources[locale] = {
                translation: translations[locale],
            };
        }

        return resources;
    }
}
