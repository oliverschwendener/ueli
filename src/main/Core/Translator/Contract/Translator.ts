import { InitOptions, TFunction } from "i18next";

type Translate = TFunction<"translation", undefined>;

export interface Translator {
    createInstance(resources: InitOptions["resources"]): Promise<Translate>;
}
