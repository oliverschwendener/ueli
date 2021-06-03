import { OperatingSystemSetting } from "./operating-system-setting";
import { OperatingSystemSettingRepository } from "./operating-system-setting-repository";
import { TranslationSet } from "../../../common/translation/translation-set";
import { getApplicationIconFilePath } from "../application-search-plugin/application-icon-helpers";
import { basename, extname, normalize } from "path";
import { IconType } from "../../../common/icon/icon-type";
import { generateMacAppIcons } from "../application-search-plugin/mac-os-app-icon-generator";
import { executeCommandWithOutput } from "../../executors/command-executor";

export class MacOsOperatingSystemSettingRepository implements OperatingSystemSettingRepository {
    private all: OperatingSystemSetting[] = [];

    constructor() {
        this.getFilePaths()
            .then((filePaths) => {
                generateMacAppIcons(filePaths)
                    .then(() => (this.all = filePaths.map((filePath) => this.buildOperatingSystemSetting(filePath))))
                    .catch((err) => (this.all = []));
            })
            .catch((err) => {
                throw new Error(`Error while reading macos system preferences: ${err}`);
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

    private getFilePaths(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            executeCommandWithOutput(`mdfind "kind:preferences"`)
                .then((data) => {
                    const result = data
                        .split("\n")
                        .map((l) => normalize(l).trim())
                        .filter((l) => l.length > 2);

                    resolve(result);
                })
                .catch((err) => reject(err));
        });
    }
}
