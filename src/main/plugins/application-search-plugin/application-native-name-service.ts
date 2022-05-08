import os from "os";
import pLimit from "p-limit";
import { pinyin } from "pinyin-pro";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { Logger } from "../../../common/logger/logger";
import { Language } from "../../../common/translation/language";
import { executeCommandWithOutput } from "../../executors/command-executor";
import { Application } from "./application";
import { ApplicationNativeNameCaches } from "./application-native-name-cache";
import { applicationNativeNameCachePath } from "./application-native-name-helpers";

const limit = pLimit(os.cpus().length);

export class ApplicationNativeNameService {
    private readonly logger: Logger;
    private readonly language: Language;
    private caches: ApplicationNativeNameCaches = {};

    constructor(language: Language, logger: Logger) {
        this.language = language;
        this.logger = logger;
    }

    public async generateAppNativeName(applications: Application[]): Promise<void> {
        const exists = await FileHelpers.fileExists(applicationNativeNameCachePath);
        if (exists.fileExists) {
            const caches = await this.readCaches();
            Object.assign(this.caches, caches);
        }
        let hasCache = false;
        const generateTasks = applications.map((application) =>
            limit(async () => {
                if (!application.nativeName) {
                    const cache = this.caches[application.filePath];
                    if (cache) {
                        application.nativeName = cache.nativeName;
                        application.keyword = cache.keyword;
                        return;
                    }
                    const nativeName = await this.getNativeName(application.filePath);
                    application.nativeName = nativeName;
                    const keyword = await this.getKeyword(application);
                    this.caches[application.filePath] = { nativeName, keyword };
                    application.keyword = keyword;
                    hasCache = true;
                }
            }),
        );
        await Promise.all(generateTasks);
        if (hasCache) await FileHelpers.writeFile(applicationNativeNameCachePath, JSON.stringify(this.caches));
        this.logger.debug(`[ApplicationNativeNameService] refresh!`);
    }

    public async clearCache(): Promise<void> {
        this.caches = {};
        await FileHelpers.deleteFile(applicationNativeNameCachePath);
        this.logger.debug(`[ApplicationNativeNameService] clear!`);
    }

    private async readCaches() {
        const data = await FileHelpers.readFile(applicationNativeNameCachePath);
        return JSON.parse(data);
    }

    private async getNativeName(filePath: string): Promise<string | undefined> {
        try {
            return await executeCommandWithOutput(`mdls -name kMDItemDisplayName -r "${filePath}"`);
        } catch (e) {
            console.error("failed execute command", e);
        }
    }

    private async getKeyword(application: Application): Promise<string[] | undefined> {
        if (this.language === Language.Chinese && application.nativeName) {
            if (/\p{Unified_Ideograph}/u.test(application.nativeName)) {
                const keyword = [];
                const charList = application.nativeName.split("");
                for (let i = 0; i < charList.length; i++) {
                    const char = charList[i];
                    if (/\p{Unified_Ideograph}/u.test(char)) {
                        if (keyword[keyword.length - 1] !== " ") keyword.push(" ");
                        keyword.push(pinyin(char, { toneType: "none" }));
                        keyword.push(" ");
                    } else {
                        keyword.push(char);
                    }
                }
                const key = keyword.join("");
                return [key, key.replace(/(^|\s)(\w)\w*/g, "$2")];
            }
        }
    }
}
