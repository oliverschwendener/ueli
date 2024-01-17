import type { InitOptions, TFunction } from "i18next";

export interface Translator {
    createInstance(resources: InitOptions["resources"]): Promise<TFunction<"translation", undefined>>;
}
