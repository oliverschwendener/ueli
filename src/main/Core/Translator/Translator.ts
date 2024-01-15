import { createInstance, type Resource, type TFunction } from "i18next";
import type { SettingsManager } from "..";
import type { Translator as TranslatorInterface } from "./Contract";

export class Translator implements TranslatorInterface {
    public constructor(private readonly settingsManager: SettingsManager) {}

    public createInstance(resources: Resource): Promise<TFunction<"translation", undefined>> {
        return new Promise((resolve, reject) => {
            createInstance(
                { resources, lng: this.settingsManager.getValue("general.language", "en-US") },
                (error, t) => (error ? reject(error) : resolve(t)),
            );
        });
    }
}
