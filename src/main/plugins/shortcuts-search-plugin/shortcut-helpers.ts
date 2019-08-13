import { Shortcut } from "./shortcut";
import { ShortcutType } from "./shortcut-type";
import { IconType } from "../../../common/icon/icon-type";
import { isValidIconParameter } from "../../../common/icon/icon-helpers";

export const defaultNewShortcut: Shortcut = {
    description: "",
    executionArgument: "",
    icon: {
        parameter: "",
        type: IconType.URL,
    },
    name: "",
    needsUserConfirmationBeforeExecution: false,
    tags: [],
    type: ShortcutType.Url,
};

export function isValidShortcuType(shortcutType: ShortcutType): boolean {
    return Object.values(ShortcutType).find((s) => s === shortcutType) !== undefined;
}

export function isValidShortcutToAdd(shortcut: Shortcut, filePathValidator: (filePath: string) => boolean): boolean {
    let iconCondition = true;
    if (shortcut.icon.parameter && shortcut.icon.parameter.length > 0) {
        iconCondition = isValidIconParameter(shortcut.icon);
    }

    return shortcut !== undefined
        && isValidShortcutExecutionArgument(shortcut, filePathValidator)
        && isValidShortcuType(shortcut.type)
        && iconCondition;
}

export function isValidShortcutExecutionArgument(shortcut: Shortcut, filePathValidator: (filePath: string) => boolean): boolean {
    switch (shortcut.type) {
        case ShortcutType.Url:
            return isValidShorcutUrl(shortcut.executionArgument);
        case ShortcutType.FilePath:
            return isValidShortcutFilePath(shortcut.executionArgument, filePathValidator);
        case ShortcutType.CommandlineTool:
            return isValidShortcutCommand(shortcut.executionArgument);
    }
}

function isValidShorcutUrl(url: string): boolean {
    return url !== undefined
        && (url.startsWith("https://") || url.startsWith("http://"));
}

function isValidShortcutFilePath(filePath: string, filePathValidator: (filePath: string) => boolean): boolean {
    return filePath !== undefined && filePathValidator(filePath);
}

function isValidShortcutCommand(command: string): boolean {
    return command.length > 0;
}
