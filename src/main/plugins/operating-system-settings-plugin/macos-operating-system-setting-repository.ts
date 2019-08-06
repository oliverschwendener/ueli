import { OperatingSystemSetting } from "./operating-system-setting";
import { OperatingSystemSettingRepository } from "./operating-system-setting-repository";
import { TranslationSet } from "../../../common/translation/translation-set";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { getApplicationIconFilePath } from "../application-search-plugin/application-icon-helpers";
import { basename, extname } from "path";
import { IconType } from "../../../common/icon/icon-type";
import { generateMacAppIcons } from "../application-search-plugin/mac-os-app-icon-generator";

export class MacOsOperatingSystemSettingRepository implements OperatingSystemSettingRepository {
    private readonly basePath = "/System/Library/PreferencePanes";
    private all: OperatingSystemSetting[];

    constructor() {
        FileHelpers.readFilesFromFolder(this.basePath)
            .then((filePaths) => {
                generateMacAppIcons(filePaths)
                    .then(() => this.all = filePaths.map((filePath) => this.buildOperatingSystemSetting(filePath)))
                    .catch((err) => this.all = []);
            })
            .catch((err) => {
                throw new Error(`Error while reading macos operating system commands: ${err}`);
            });
    }

    public getAll(translationSet: TranslationSet): Promise<OperatingSystemSetting[]> {
        return new Promise((resolve) => {
            resolve(this.all);
        });
    }

    private buildOperatingSystemSetting(filePath: string): OperatingSystemSetting {
        return {
            description: filePath,
            executionArgument: filePath,
            icon: { parameter: getApplicationIconFilePath(filePath), type: IconType.URL },
            name: basename(filePath).replace(extname(filePath), ""),
            tags: [],
        };
    }
}
