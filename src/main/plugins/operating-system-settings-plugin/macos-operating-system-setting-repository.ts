import { OperatingSystemSetting } from "./operating-system-setting";
import { OperatingSystemSettingRepository } from "./operating-system-setting-repository";
import { TranslationSet } from "../../../common/translation/translation-set";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { applicationIconLocation } from "../application-search-plugin/application-icon-helpers";
import { convert } from "app2png";
import { basename, join, extname } from "path";
import { IconType } from "../../../common/icon/icon-type";

export class MacOsOperatingSystemSettingRepository implements OperatingSystemSettingRepository {
    private readonly basePath = "/System/Library/PreferencePanes";
    private all: OperatingSystemSetting[];

    constructor() {
        FileHelpers.readFilesFromFolder(this.basePath)
            .then((filePaths) => {
                Promise.all(filePaths.map((filePath) => this.buildOperatingSystemSetting(filePath)))
                    .then((results) => this.all = results)
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

    private buildOperatingSystemSetting(filePath: string): Promise<OperatingSystemSetting> {
        return new Promise((resolve, reject) => {
            const iconFilePath = join(applicationIconLocation, `${basename(filePath)}.png`);
            convert(filePath, iconFilePath)
                .then(() => {
                    resolve({
                        description: filePath,
                        executionArgument: filePath,
                        icon: { parameter: iconFilePath, type: IconType.URL },
                        name: basename(filePath).replace(extname(filePath), ""),
                        tags: [],
                    });
                })
                .catch((err) => reject(err));
        });
    }
}
