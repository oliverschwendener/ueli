import { TranslationSet } from "../../../common/translation/translation-set";
import { OperatingSystemSetting } from "./operating-system-setting";

export interface OperatingSystemSettingRepository {
    getAll(translationSet: TranslationSet): Promise<OperatingSystemSetting[]>;
}
