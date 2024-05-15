import type { Translations } from "@common/Core/Extension";
import type { i18n } from "i18next";

/**
 * Offers a method to create a translation function.
 */
export interface Translator {
    /**
     * Creates an i18n instance. This can be used in extensions or modules to translate strings separately from
     * other extensions or modules.
     * @param translations The translations to use.
     * @returns An i18n instance.
     */
    createInstance(translations: Translations): i18n;
}
