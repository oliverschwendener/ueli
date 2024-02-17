import type { SystemSetting } from "./SystemSetting";

export interface SystemSettingRepository {
    getAll(): SystemSetting[];
}
