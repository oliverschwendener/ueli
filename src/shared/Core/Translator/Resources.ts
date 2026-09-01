import type { Translations } from "./Translations";

export type Resources<T extends Translations> = Record<string, T>;
