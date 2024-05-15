import type { Resources, Translations } from "@common/Core/Translator";
import type { SystemCommand } from "./SystemCommand";

export interface SystemCommandRepository {
    getAll(resources: Resources<Translations>): Promise<SystemCommand[]>;
}
