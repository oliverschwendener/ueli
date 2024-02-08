import type { Shortcut, ShortcutType } from "@common/Extensions/Shortcuts";
import { isValidFilePath } from "./isValidFilePath";
import { isValidName } from "./isValidName";
import { isValidUrl } from "./isValidUrl";

export const isValidShortcut = (shortcut: Shortcut): boolean => {
    const argumentValidators: Record<ShortcutType, (argument: string) => boolean> = {
        File: (argument) => isValidFilePath(argument),
        Url: (argument) => isValidUrl(argument),
    };

    const validators = [() => isValidName(shortcut.name), () => argumentValidators[shortcut.type](shortcut.argument)];

    return validators.every((validator) => validator());
};
