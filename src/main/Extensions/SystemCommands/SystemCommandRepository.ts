import type { Translations } from "@common/Core/Extension";
import type { SystemCommand } from "./SystemCommand";

export interface SystemCommandRepository {
    getAll(translations: Translations): Promise<SystemCommand[]>;
}
