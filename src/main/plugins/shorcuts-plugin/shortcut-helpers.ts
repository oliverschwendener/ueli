import { Shortcut } from "./shortcut";
import { ShortcutType } from "./shortcut-type";
import { IconTypeHelpers } from "../../../common/icon/icon-type-helpers";

export class ShortcutHelpers {
    public static isValidShortcut(shortcut: Shortcut): boolean {
        return shortcut.description !== undefined
            && shortcut.description.length !== 0
            && shortcut.executionArgument !== undefined
            && shortcut.executionArgument.length !== 0
            && shortcut.icon !== undefined
            && shortcut.icon.parameter !== undefined
            && IconTypeHelpers.isValidIconType(shortcut.icon.type)
            && this.isValidShortcuType(shortcut.type);
    }

    public static isValidShortcuType(shortcutType: ShortcutType): boolean {
        return Object.values(ShortcutType).find((s) => s === shortcutType) !== undefined;
    }
}
