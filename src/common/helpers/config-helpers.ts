import { UserConfigOptions } from "../config/user-config-options";
import { GlobalHotKeyModifier } from "../global-hot-key/global-hot-key-modifier";
import { deepCopy } from "./object-helpers";

export function mergeUserConfigWithDefault(userConfig: any, defaultUserConfig: UserConfigOptions): UserConfigOptions {
    const result: any = deepCopy(defaultUserConfig);

    Object.keys(defaultUserConfig).forEach((key: string) => {
        const merged =
            userConfig !== undefined && userConfig.hasOwnProperty(key)
                ? Object.assign(result[key], userConfig[key])
                : result[key];
        result[key] = merged;
    });

    if (!result.generalOptions.hotKey.secondModifier) {
        result.generalOptions.hotKey.secondModifier = GlobalHotKeyModifier.None;
    }

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
