import type { KeyboardEvent } from "react";
import { deserializeKeyboardShortcut } from "./deserializeKeyboardShortcut";

export const keyboardEventMatchesKeyboardShortcut = (keyboardEvent: KeyboardEvent, keyboardShortcut: string) => {
    const { modifier, key } = deserializeKeyboardShortcut(keyboardShortcut);

    const conditions: (() => boolean)[] = [
        () => keyboardEvent.key.toLowerCase() === key.toLowerCase(),
        () => !!keyboardEvent.ctrlKey === (modifier === "Ctrl"),
        () => !!keyboardEvent.metaKey === (modifier === "Cmd"),
        () => !!keyboardEvent.shiftKey === (modifier === "Shift"),
        () => !!keyboardEvent.altKey === (modifier === "Alt"),
    ];

    return conditions.every((c) => c());
};
