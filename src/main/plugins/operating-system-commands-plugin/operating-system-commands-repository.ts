import { OperatingSystemCommand } from "./operating-system-command";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";

export interface OperatingSystemCommandRepository {
    getAll(): Promise<OperatingSystemCommand[]>;
    updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void>;
}
