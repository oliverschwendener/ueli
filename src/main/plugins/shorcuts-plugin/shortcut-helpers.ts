import { Shortcut } from "./shortcut";
import { ShortcutType } from "./shortcut-type";
import { IconType } from "../../../common/icon/icon-type";

export const defaultNewShortcut = {
    icon: {
        type: IconType.URL,
    },
    type: ShortcutType.Url,
} as Shortcut;

export class ShortcutHelpers {
    public static isValidShortcuType(shortcutType: ShortcutType): boolean {
        return Object.values(ShortcutType).find((s) => s === shortcutType) !== undefined;
    }

    public static isValidToAdd(shortcut: Shortcut, filePathValidator: (filePath: string) => boolean): boolean {
        return shortcut !== undefined
            && this.isValidExecutionArgument(shortcut, filePathValidator)
            && this.isValidShortcuType(shortcut.type);
    }

    public static isValidExecutionArgument(shortcut: Shortcut, filePathValidator: (filePath: string) => boolean): boolean {
        switch (shortcut.type) {
            case ShortcutType.Url:
                return this.isValidUrl(shortcut.executionArgument);
            case ShortcutType.FilePath:
                return this.isValidFilePath(shortcut.executionArgument, filePathValidator);
        }
    }

    private static isValidUrl(url: string): boolean {
        return url !== undefined
            && (url.startsWith("https://") || url.startsWith("http://"));
    }

    private static isValidFilePath(filePath: string, filePathValidator: (filePath: string) => boolean): boolean {
        return filePath !== undefined && filePathValidator(filePath);
    }
}
