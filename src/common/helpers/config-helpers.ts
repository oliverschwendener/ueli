import { UserConfigOptions } from "../config/user-config-options";
import { cloneDeep } from "lodash";

export function mergeUserConfigWithDefault(userConfig: any, defaultUserConfig: UserConfigOptions): UserConfigOptions {
    const result: any = cloneDeep(defaultUserConfig);

    Object.keys(defaultUserConfig).forEach((key: string) => {
        const merged = userConfig !== undefined && userConfig.hasOwnProperty(key)
            ? Object.assign(result[key], userConfig[key])
            : result[key];
        result[key] = merged;
    });

    return result;
}

export function isValidJson(userConfig: string): boolean {
    try {
        JSON.parse(userConfig);
        return true;
    } catch (err) {
        return false;
    }
}
