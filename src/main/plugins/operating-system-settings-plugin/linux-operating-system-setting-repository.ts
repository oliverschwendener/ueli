import { OperatingSystemSetting } from "./operating-system-setting";
import { OperatingSystemSettingRepository } from "./operating-system-setting-repository";
import { TranslationSet } from "../../../common/translation/translation-set";


// TODO: implement gnome/kde settings support
export class LinuxOperatingSystemSettingRepository implements OperatingSystemSettingRepository {
    private all: OperatingSystemSetting[] = [];

    constructor() {
        this.all = []
    }

    public getAll(translationSet: TranslationSet): Promise<OperatingSystemSetting[]> {
        return new Promise((resolve) => {
            resolve(this.all);
        });
    }
}
