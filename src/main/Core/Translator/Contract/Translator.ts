import type { Translations } from "@common/Core/Extension";
import type { TFunction } from "i18next";

/**
 * Offers a method to create a translation function.
 */
export interface Translator {
    /**
     * Creates a translation function. This can be used in extensions or modules to translate strings separately from
     * other extensions modules.
     * @param translations The translations to use.
     * @returns A promise which resolves to a translation function.
     */
    createInstance(translations: Translations): Promise<TFunction<"translation", undefined>>;
}
