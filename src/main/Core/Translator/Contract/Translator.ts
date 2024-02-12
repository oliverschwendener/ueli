import type { Translations } from "@common/Core/Extension";
import type { TFunction } from "i18next";

export interface Translator {
    createInstance(translations: Translations): Promise<TFunction<"translation", undefined>>;
}
