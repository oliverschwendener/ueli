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
        (async (): Promise<void> => {
            try {
                const filePaths = await FileHelpers.readFilesFromFolder(this.basePath);
                const result = await Promise.all(filePaths.map((filePath) => this.buildOperatingSystemSetting(filePath)));
                this.all = result;
            } catch (error) {
                this.all = [];
            }
        })();
    }

    public async getAll(translationSet: TranslationSet): Promise<OperatingSystemSetting[]> {
        return this.all;
    }

    private async buildOperatingSystemSetting(filePath: string): Promise<OperatingSystemSetting> {
        const iconFilePath = join(applicationIconLocation, `${basename(filePath)}.png`);
        try {
            await convert(filePath, iconFilePath);
            return {
                description: filePath,
                executionArgument: filePath,
                icon: { parameter: iconFilePath, type: IconType.URL },
                name: basename(filePath).replace(extname(filePath), ""),
                tags: [],
            };
        } catch (error) {
            return error;
        }
    }
}
