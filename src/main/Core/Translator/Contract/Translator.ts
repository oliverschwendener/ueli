import type { Resources, Translations } from "@common/Core/Translator";
import type { TFunction } from "./TFunction";

/**
 * Offers a method to create a translation function.
 */
export interface Translator {
    /**
     * Creates a translation function. This can be used in extensions or modules to translate strings separately from other parts of the app.
     * @param resources The resources for the translations.
     * @returns A translate function
     */
    createT<T extends Translations>(resources: Resources<T>): { t: TFunction };
}
