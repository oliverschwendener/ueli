import type { LinuxSystemSetting } from "./LinuxSystemSetting";
import type { SystemSettingRepository } from "./SystemSettingRepository";

export class LinuxSystemSettingRepository implements SystemSettingRepository {
    public getAll(): LinuxSystemSetting[] {
        return [];
    }
}
